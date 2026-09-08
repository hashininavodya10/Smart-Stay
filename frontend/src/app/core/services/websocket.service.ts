import { Injectable, NgZone } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private connectionState = new BehaviorSubject<boolean>(false);
  
  // Observables for incoming messages
  private taskUpdates = new Subject<any>();
  private chatMessages = new Subject<any>();
  private roomChatMessages = new Subject<any>();
  private priorityAlerts = new Subject<any>();
  private roomUpdates = new Subject<any>();

  constructor(private zone: NgZone) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8082/ws-hotel', // Ensure to match backend config
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame: any) => {
      console.log('Connected to WebSocket Broker: ' + frame);
      this.zone.run(() => {
        this.connectionState.next(true);
      });
      
      // Global subscriptions for staff/admins
      this.client.subscribe('/topic/tasks', (message: Message) => {
        const payload = JSON.parse(message.body);
        this.zone.run(() => {
          this.taskUpdates.next(payload);
          if (payload.priority === 'HIGH' || payload.priority === 'MEDIUM') {
            this.priorityAlerts.next(payload);
          }
        });
      });
      
      this.client.subscribe('/topic/chat', (message: Message) => {
        this.zone.run(() => {
          this.chatMessages.next(JSON.parse(message.body));
        });
      });
    };

    this.client.onStompError = (frame: any) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.onWebSocketClose = () => {
      this.zone.run(() => {
        this.connectionState.next(false);
      });
    };
  }

  public connect(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
    }
  }
  
  public getConnectionState(): Observable<boolean> {
    return this.connectionState.asObservable();
  }

  // Subscribe to specific room (for Guest View)
  public subscribeToRoom(roomToken: string): StompSubscription | null {
    if (this.client.connected) {
      return this.client.subscribe(`/topic/room/${roomToken}`, (message: Message) => {
        this.zone.run(() => {
          const payload = JSON.parse(message.body);
          // If it has staffName, it's an assignment/update, otherwise chat
          if (payload.staffName || payload.status) {
            this.roomUpdates.next(payload);
          } else {
            this.roomChatMessages.next(payload);
          }
        });
      });
    }
    return null;
  }

  // Publishers
  public sendChatMessage(roomToken: string, content: string, sender: string = 'GUEST'): void {
    if (this.client.connected) {
      this.client.publish({
        destination: `/app/chat/${roomToken}`,
        body: JSON.stringify({ roomToken, content, sender })
      });
    }
  }

  public sendServiceRequest(roomToken: string, type: string, description: string): void {
    if (this.client.connected) {
      this.client.publish({
        destination: `/app/request/${roomToken}`,
        body: JSON.stringify({ type, description }) // Backend will inject roomToken
      });
    }
  }

  public assignStaff(roomToken: string, staffName: string, taskId?: number): void {
    if (this.client.connected) {
      this.client.publish({
        destination: `/app/assign`,
        body: JSON.stringify({ id: taskId, roomToken, staffName, status: 'ACCEPTED' })
      });
    }
  }

  public updateTaskStatus(roomToken: string, status: string, taskId?: number): void {
    if (this.client.connected) {
      this.client.publish({
        destination: `/app/status`,
        body: JSON.stringify({ id: taskId, roomToken, status })
      });
    }
  }

  // Getters for Observables
  public getTaskUpdates(): Observable<any> {
    return this.taskUpdates.asObservable();
  }

  public getChatMessages(): Observable<any> {
    return this.chatMessages.asObservable();
  }

  public getRoomChatMessages(): Observable<any> {
    return this.roomChatMessages.asObservable();
  }

  public getPriorityAlerts(): Observable<any> {
    return this.priorityAlerts.asObservable();
  }

  public getRoomUpdates(): Observable<any> {
    return this.roomUpdates.asObservable();
  }
}
