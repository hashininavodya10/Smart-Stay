import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
      <!-- Premium Header -->
      <header class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 shadow-lg flex justify-between items-center sticky top-0 z-20">
        <div class="flex items-center gap-4">
            <div class="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold tracking-wide">Staff Workspace</h1>
              <p class="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5 font-medium tracking-wide">
                <span class="flex h-2 w-2 relative">
                  <span *ngIf="isConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" [ngClass]="isConnected ? 'bg-green-500' : 'bg-red-500'"></span>
                </span>
                {{ isConnected ? 'Connected & Live' : 'Reconnecting...' }}
              </p>
            </div>
        </div>
        <div class="flex gap-4 items-center">
            <div class="text-right hidden sm:block">
               <p class="text-sm font-bold text-white">Staff Member</p>
               <p class="text-[10px] text-slate-400 uppercase tracking-widest">Active Shift</p>
            </div>
            <button class="bg-slate-700/50 hover:bg-slate-700 p-2.5 rounded-full relative transition-colors border border-slate-600/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span *ngIf="alerts.length > 0" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>
                <span *ngIf="alerts.length > 0" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-slate-800">{{ alerts.length }}</span>
            </button>
        </div>
      </header>

      <!-- Task Feed -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center overflow-y-auto">
        <div class="w-full max-w-3xl space-y-4">
            
            <div class="flex justify-between items-center mb-6">
               <h2 class="text-lg font-bold text-slate-800 tracking-tight">Your Assignments</h2>
               <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{{ tasks.length }} Active</span>
            </div>

            <!-- Empty State -->
            <div *ngIf="tasks.length === 0" class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div class="bg-slate-50 p-4 rounded-full mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-700">All Caught Up!</h3>
                <p class="text-sm text-slate-500 mt-2 max-w-xs">You have no pending assignments. New tasks assigned to you will appear here automatically.</p>
            </div>

            <!-- Dynamic Tasks from WebSocket/REST -->
            <div *ngFor="let task of tasks" 
                 class="rounded-2xl shadow-sm border p-5 sm:p-6 transform transition-all hover:shadow-md relative overflow-hidden animate-fade-in-down bg-white"
                 [ngClass]="task.description?.includes('HIGH') ? 'border-red-200 bg-red-50/10' : 'border-slate-200'">
                 
                <!-- Urgent Pulse Background -->
                <div *ngIf="task.description?.includes('HIGH')" class="absolute inset-0 bg-red-50 opacity-50 animate-pulse pointer-events-none"></div>
                <div *ngIf="task.description?.includes('HIGH')" class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div *ngIf="!task.description?.includes('HIGH')" class="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex gap-2">
                            <span class="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider"
                                  [ngClass]="task.description?.includes('HIGH') ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'">
                                {{ task.type || 'Service' }}
                            </span>
                            <span *ngIf="task.status === 'IN_PROGRESS'" class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider animate-pulse">
                                In Progress
                            </span>
                        </div>
                        <span class="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Room {{ task.roomToken }}</span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-800 tracking-tight" [ngClass]="{'text-red-900': task.description?.includes('HIGH')}">
                       {{ task.description?.includes('HIGH') ? 'Emergency Request' : 'Guest Request' }}
                    </h3>
                    <p class="text-slate-600 mt-2 leading-relaxed text-sm sm:text-base">{{ task.description || task.content }}</p>
                    
                    <div class="mt-6 flex flex-col sm:flex-row gap-3">
                        <button *ngIf="task.status !== 'IN_PROGRESS'" 
                                (click)="startJob(task)" 
                                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Job
                        </button>
                        
                        <button *ngIf="task.status === 'IN_PROGRESS'" 
                                (click)="completeJob(task)" 
                                class="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Completed
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </main>
      
      <!-- Audio Context for Alarms (Hidden) -->
      <audio #highPriorityAudio src="assets/high-alert.mp3" loop preload="auto"></audio>
      <audio #mediumPriorityAudio src="assets/med-alert.mp3" preload="auto"></audio>
    </div>
  `
})
export class StaffDashboardComponent implements OnInit, OnDestroy {
  isConnected: boolean = false;
  tasks: any[] = [];
  alerts: any[] = [];
  private subscriptions: Subscription = new Subscription();

  private sortTasks(tasks: any[]): any[] {
    return tasks.sort((a, b) => {
      const getPriorityValue = (t: any) => {
        const desc = (t.description || '').toUpperCase();
        if (t.priority === 'HIGH' || desc.includes('HIGH') || desc.includes('CRITICAL')) return 3;
        if (t.priority === 'MEDIUM' || desc.includes('MEDIUM')) return 2;
        return 1;
      };
      return getPriorityValue(b) - getPriorityValue(a);
    });
  }

  constructor(private wsService: WebsocketService, private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch initial active tasks
    this.http.get<any[]>('http://localhost:8082/api/requests/all').subscribe(data => {
        // Filter out completed tasks to keep the feed clean
        const activeTasks = data.filter((t: any) => t.status !== 'COMPLETED');
        // Map backend objects
        const mapped = activeTasks.map((t: any) => ({
           id: t.id,
           roomToken: t.room?.token || t.roomToken,
           type: t.type,
           status: t.status,
           description: t.description,
           staffName: t.staff?.username || t.staffName
        }));
        this.tasks = this.sortTasks(mapped);
    });

    this.wsService.connect();

    this.subscriptions.add(
      this.wsService.getConnectionState().subscribe(state => {
        this.isConnected = state;
      })
    );

    this.subscriptions.add(
      this.wsService.getTaskUpdates().subscribe(incomingTask => {
        if (incomingTask.status === 'ACCEPTED' || incomingTask.status === 'IN_PROGRESS') {
          // This is a status update. Find the existing task by id, or fallback to roomToken.
          const existingTask = incomingTask.id 
             ? this.tasks.find(t => t.id === incomingTask.id)
             : this.tasks.find(t => t.roomToken === incomingTask.roomToken);
             
          if (existingTask) {
            existingTask.status = incomingTask.status;
            if (incomingTask.staffName) {
              existingTask.staffName = incomingTask.staffName;
            }
            this.tasks = this.sortTasks([...this.tasks]);
          }
        } else if (incomingTask.status === 'COMPLETED') {
          // Remove the task from the staff feed since it is done
          if (incomingTask.id) {
             this.tasks = this.tasks.filter(t => t.id !== incomingTask.id);
          } else {
             this.tasks = this.tasks.filter(t => t.roomToken !== incomingTask.roomToken);
          }
        } else {
          // It's a new request
          // Don't add if it's already there (prevent duplication on echo)
          const isDuplicate = incomingTask.id 
              ? this.tasks.find(t => t.id === incomingTask.id)
              : this.tasks.find(t => t.roomToken === incomingTask.roomToken && t.type === incomingTask.type);
              
          if (!isDuplicate) {
            // Use spread syntax to trigger Angular change detection
            this.tasks = this.sortTasks([incomingTask, ...this.tasks]);
          }
        }
      })
    );

    this.subscriptions.add(
      this.wsService.getPriorityAlerts().subscribe(alert => {
        this.alerts.push(alert);
        this.playAlarm(alert.priority);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.wsService.disconnect();
  }

  playAlarm(priority: string): void {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Simple oscillator synthesis for alerts as fallback if mp3s are missing
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (priority === 'HIGH') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime + 0.5); // A4
            // In a real app, this would loop until acknowledged
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5);
        } else if (priority === 'MEDIUM') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        }
    } catch (e) {
        console.error('AudioContext playback failed', e);
    }
  }

  startJob(task: any): void {
    if (!task.roomToken) return;
    
    // Send status update to backend
    this.wsService.updateTaskStatus(task.roomToken, 'IN_PROGRESS', task.id);
    
    // Update local UI
    task.status = 'IN_PROGRESS';
  }
  
  completeJob(task: any): void {
    if (!task.roomToken) return;
    
    // Send status update to backend
    this.wsService.updateTaskStatus(task.roomToken, 'COMPLETED', task.id);
    
    // Remove from local UI immediately
    this.tasks = this.tasks.filter(t => t !== task);
  }
}
