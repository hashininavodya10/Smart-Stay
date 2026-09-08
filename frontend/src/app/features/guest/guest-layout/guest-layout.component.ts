import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guest-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
      <!-- Header -->
      <header class="bg-indigo-600 text-white p-6 shadow-md rounded-b-3xl">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Welcome!</h1>
            <p class="text-indigo-100 text-sm mt-1">Room {{ roomToken ? roomToken : 'Connecting...' }}</p>
          </div>
          <div class="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 flex flex-col gap-6 -mt-4 z-10">
        
        <!-- Quick Action Buttons -->
        <section class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-gray-800 font-semibold">Request Service</h2>
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500">Schedule Later</label>
              <button (click)="toggleSchedule()" [ngClass]="isScheduling ? 'bg-indigo-500' : 'bg-gray-200'" class="w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none">
                <span [ngClass]="isScheduling ? 'translate-x-5' : 'translate-x-0'" class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm"></span>
              </button>
            </div>
          </div>
          
          <!-- Date/Time Picker (Visible if isScheduling is true) -->
          <div *ngIf="isScheduling" class="mb-4 animate-fade-in-down">
            <input type="datetime-local" [(ngModel)]="scheduledTime" class="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button (click)="requestService('HOUSEKEEPING')" class="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-sm font-medium">Housekeeping</span>
            </button>
            <button (click)="requestService('MEALS')" class="flex flex-col items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
              </svg>
              <span class="text-sm font-medium">Dining</span>
            </button>
            <button (click)="requestService('MAINTENANCE')" class="flex flex-col items-center justify-center p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span class="text-sm font-medium">Maintenance</span>
            </button>
            <button (click)="sendPriorityAlert()" class="flex flex-col items-center justify-center p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="text-sm font-medium text-center">Report Problem</span>
            </button>
          </div>
        </section>

        <!-- Status Tracker Timeline -->
        <section class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex-1">
          <h2 class="text-gray-800 font-semibold mb-4">Request Status</h2>
          <div class="relative border-l-2 border-indigo-100 ml-3 space-y-6">
            <div class="mb-8 flex items-center w-full animate-fade-in-down">
              <div [ngClass]="currentStatus !== 'IDLE' ? 'bg-indigo-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full -ml-1.5 mt-1 border-2 border-white transition-colors duration-500"></div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium" [ngClass]="currentStatus !== 'IDLE' ? 'text-gray-800' : 'text-gray-400'">New Request</p>
                <p class="text-xs text-gray-400">Waiting for staff</p>
              </div>
            </div>
            <div class="mb-8 flex items-center w-full animate-fade-in-down">
              <div [ngClass]="currentStatus === 'ACCEPTED' || currentStatus === 'IN_PROGRESS' || currentStatus === 'COMPLETED' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-gray-300'" class="w-3 h-3 rounded-full -ml-1.5 mt-1 border-2 border-white transition-all duration-500"></div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium" [ngClass]="currentStatus === 'ACCEPTED' || currentStatus === 'IN_PROGRESS' || currentStatus === 'COMPLETED' ? 'text-gray-800' : 'text-gray-400'">Accepted</p>
                <p class="text-xs" [ngClass]="currentStatus === 'ACCEPTED' ? 'text-indigo-600 font-semibold' : 'text-gray-400'">
                    {{ assignedStaff ? 'Assigned: ' + assignedStaff : 'Staff assigned' }}
                </p>
              </div>
            </div>
            <div class="mb-8 flex items-center w-full animate-fade-in-down">
              <div [ngClass]="currentStatus === 'IN_PROGRESS' || currentStatus === 'COMPLETED' ? 'bg-indigo-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full -ml-1.5 mt-1 border-2 border-white transition-colors duration-500"></div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium" [ngClass]="currentStatus === 'IN_PROGRESS' || currentStatus === 'COMPLETED' ? 'text-gray-800' : 'text-gray-400'">In-Progress</p>
                <p class="text-xs text-gray-400">Being worked on</p>
              </div>
            </div>
            <div class="flex items-center w-full animate-fade-in-down">
              <div [ngClass]="currentStatus === 'COMPLETED' ? 'bg-indigo-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full -ml-1.5 mt-1 border-2 border-white transition-colors duration-500"></div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium" [ngClass]="currentStatus === 'COMPLETED' ? 'text-gray-800' : 'text-gray-400'">Completed</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Floating Chatbot Widget -->
      <div class="fixed bottom-6 right-6 z-50">
        <!-- Chat Window (Hidden by default) -->
        <div *ngIf="isChatOpen" class="bg-white w-80 h-96 rounded-2xl shadow-2xl mb-4 border border-gray-100 flex flex-col overflow-hidden transition-all transform origin-bottom-right">
          <div class="bg-indigo-600 text-white p-3 flex justify-between items-center">
            <span class="font-medium">Hotel Concierge</span>
            <button (click)="toggleChat()" class="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div #chatContainer class="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            <!-- Messages -->
            <div *ngFor="let msg of messages" 
                 [ngClass]="msg.sender === 'GUEST' ? 'self-end bg-indigo-600 text-white' : 'self-start bg-white text-gray-700'"
                 class="p-2.5 rounded-2xl shadow-sm text-sm max-w-[80%] break-words"
                 [class.rounded-br-sm]="msg.sender === 'GUEST'"
                 [class.rounded-tl-sm]="msg.sender === 'ADMIN'">
              {{ msg.content }}
            </div>
          </div>
          <div class="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message..." class="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <button (click)="sendMessage()" class="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Toggle Button -->
        <button (click)="toggleChat()" class="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all transform hover:scale-105 float-right">
          <svg *ngIf="!isChatOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <svg *ngIf="isChatOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class GuestLayoutComponent implements OnInit, OnDestroy {
  roomToken: string = '';
  isChatOpen: boolean = false;
  isScheduling: boolean = false;
  scheduledTime: string = '';
  currentStatus: string = 'IDLE'; // IDLE, NEW, ACCEPTED, IN_PROGRESS, COMPLETED
  assignedStaff: string = '';
  messages: any[] = [
    { sender: 'ADMIN', content: 'Hello! How can I assist you today?' }
  ];
  newMessage: string = '';
  private roomSubscription: any;
  private updateSubscription: any;
  private chatSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebsocketService
  ) {}

  ngOnInit(): void {
    // Note: In a real app we'd get this from route params. Mocking for scaffolding.
    this.roomToken = this.route.snapshot.paramMap.get('token') || 'TEST-TOKEN';
    
    this.wsService.connect();
    
    // Subscribe when connection is ready
    this.wsService.getConnectionState().subscribe(connected => {
      if (connected) {
        this.roomSubscription = this.wsService.subscribeToRoom(this.roomToken);
        
        // Listen for staff assignments from Admin
        this.updateSubscription = this.wsService.getRoomUpdates().subscribe(update => {
          if (update.status === 'ACCEPTED') {
            this.currentStatus = 'ACCEPTED';
            this.assignedStaff = update.staffName;
            
            // Show a friendly notification to the guest
            alert(`Great news! ${update.staffName} has been assigned to your request and is on their way.`);
          } else if (update.status === 'IN_PROGRESS') {
            this.currentStatus = 'IN_PROGRESS';
            alert(`The staff member has arrived and started working on your request!`);
          } else if (update.status === 'COMPLETED') {
            this.currentStatus = 'COMPLETED';
            alert(`Your request has been successfully completed!`);
          }
        });
        
        // Listen for chat messages (e.g. from Admin)
        this.chatSubscription = this.wsService.getRoomChatMessages().subscribe(msg => {
          // If we are getting echoed messages, the backend sends it back to us too.
          // In a real app we might filter out our own echoes, but since we are relying on echoes
          // we just push it if it's not a duplicate. Actually, let's just push it.
          // Wait, if I push locally on send, the echo will duplicate it. Let's ONLY push from the websocket!
          this.messages.push(msg);
          
          // Auto-open chat if an admin messages us
          if (msg.sender === 'ADMIN' && !this.isChatOpen) {
            this.isChatOpen = true;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    this.wsService.disconnect();
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  toggleSchedule(): void {
    this.isScheduling = !this.isScheduling;
  }

  requestService(type: string): void {
    const desc = this.isScheduling ? `Scheduled ${type} for ${this.scheduledTime}` : `Requested ${type}`;
    this.wsService.sendServiceRequest(this.roomToken, type, desc);
    
    // Update local UI state
    this.currentStatus = 'NEW';
    this.assignedStaff = '';
    
    // Simulate UI feedback
    alert(desc);
    this.isScheduling = false; // Reset toggle
  }

  sendPriorityAlert(): void {
    // Simulating a High Priority problem
    // Instead of chat message, we should send a service request for EMERGENCY
    this.wsService.sendServiceRequest(this.roomToken, 'EMERGENCY', 'EMERGENCY: Assistance required!');
    this.currentStatus = 'NEW';
    alert('High priority alert sent!');
  }
  
  sendMessage(): void {
    if (this.newMessage.trim()) {
      // Send to backend. The backend will echo it back to our chat window.
      this.wsService.sendChatMessage(this.roomToken, this.newMessage, 'GUEST');
      this.newMessage = ''; // clear input
    }
  }
}
