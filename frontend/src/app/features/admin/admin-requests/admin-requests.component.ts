import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full overflow-hidden bg-[#0B1120]" style="font-family: 'Inter', system-ui, sans-serif;">

        <!-- Top Header Bar -->
        <header class="bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
          <div>
            <h2 class="text-xl font-black text-white tracking-tight">Requests Management</h2>
            <p class="text-slate-400 text-xs mt-0.5 tracking-wide">Manage and assign guest service requests</p>
          </div>
        </header>

        <!-- Kanban Row -->
        <div class="flex-1 flex gap-4 px-6 py-6 overflow-hidden min-h-0">

          <!-- ─── Tabbed Main Content ─── -->
          <div class="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
            <!-- Navigation Tabs -->
            <div class="flex gap-2 shrink-0 bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/5 w-fit shadow-inner">
              <button (click)="activeScreen = 'new_accepted'"
                      [ngClass]="activeScreen === 'new_accepted' ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'"
                      class="px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2">
                New & Accepted
                <span *ngIf="newAndAcceptedTasks.length > 0" class="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-md border border-red-500/20">{{ newAndAcceptedTasks.length }}</span>
              </button>
              <button (click)="activeScreen = 'in_progress'"
                      [ngClass]="activeScreen === 'in_progress' ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'"
                      class="px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2">
                In Progress
                <span class="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-md border border-blue-500/20">{{ inProgressTasks.length }}</span>
              </button>
              <button (click)="activeScreen = 'completed'"
                      [ngClass]="activeScreen === 'completed' ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'"
                      class="px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2">
                Completed
                <span class="bg-teal-500/20 text-teal-400 text-[10px] px-1.5 py-0.5 rounded-md border border-teal-500/20">{{ completedTasks.length }}</span>
              </button>
            </div>

            <!-- Screens Container -->
            <div class="flex-1 overflow-hidden">
              
              <!-- SCREEN: New & Accepted -->
              <div *ngIf="activeScreen === 'new_accepted'" class="h-full flex gap-4 min-w-0">
                <!-- High Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-red-500/10">
                    <h3 class="font-bold text-red-400 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div> High Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getHighPriorityTasks(newAndAcceptedTasks) }"></ng-container>
                    <div *ngIf="getHighPriorityTasks(newAndAcceptedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No high priority requests.</div>
                  </div>
                </div>

                <!-- Medium Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-amber-500/10">
                    <h3 class="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-amber-400"></div> Medium Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getMediumPriorityTasks(newAndAcceptedTasks) }"></ng-container>
                    <div *ngIf="getMediumPriorityTasks(newAndAcceptedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No medium priority requests.</div>
                  </div>
                </div>

                <!-- Low Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-white/5">
                    <h3 class="font-bold text-slate-300 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-slate-400"></div> Low Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getLowPriorityTasks(newAndAcceptedTasks) }"></ng-container>
                    <div *ngIf="getLowPriorityTasks(newAndAcceptedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No low priority requests.</div>
                  </div>
                </div>
              </div>

              <!-- SCREEN: In Progress -->
              <div *ngIf="activeScreen === 'in_progress'" class="h-full flex gap-4 min-w-0">
                <!-- High Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-red-500/10">
                    <h3 class="font-bold text-red-400 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div> High Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getHighPriorityTasks(inProgressTasks) }"></ng-container>
                    <div *ngIf="getHighPriorityTasks(inProgressTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No high priority active tasks.</div>
                  </div>
                </div>

                <!-- Medium Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-amber-500/10">
                    <h3 class="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-amber-400"></div> Medium Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getMediumPriorityTasks(inProgressTasks) }"></ng-container>
                    <div *ngIf="getMediumPriorityTasks(inProgressTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No medium priority active tasks.</div>
                  </div>
                </div>

                <!-- Low Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-white/5">
                    <h3 class="font-bold text-slate-300 text-sm flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-slate-400"></div> Low Priority
                    </h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getLowPriorityTasks(inProgressTasks) }"></ng-container>
                    <div *ngIf="getLowPriorityTasks(inProgressTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No low priority active tasks.</div>
                  </div>
                </div>
              </div>

              <!-- SCREEN: Completed -->
              <div *ngIf="activeScreen === 'completed'" class="h-full flex gap-4 min-w-0">
                <!-- High Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-white/5">
                    <h3 class="font-bold text-red-400 text-sm flex items-center gap-2">High Priority (Completed)</h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getHighPriorityTasks(completedTasks) }"></ng-container>
                    <div *ngIf="getHighPriorityTasks(completedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No completed high priority tasks.</div>
                  </div>
                </div>

                <!-- Medium Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-white/5">
                    <h3 class="font-bold text-amber-400 text-sm flex items-center gap-2">Medium Priority (Completed)</h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getMediumPriorityTasks(completedTasks) }"></ng-container>
                    <div *ngIf="getMediumPriorityTasks(completedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No completed medium priority tasks.</div>
                  </div>
                </div>

                <!-- Low Priority Column -->
                <div class="flex-1 flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl min-w-0 overflow-hidden">
                  <div class="p-3 border-b border-white/5 shrink-0 bg-white/5">
                    <h3 class="font-bold text-slate-300 text-sm flex items-center gap-2">Low Priority (Completed)</h3>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
                    <ng-container *ngTemplateOutlet="taskCardTemplate; context: { $implicit: getLowPriorityTasks(completedTasks) }"></ng-container>
                    <div *ngIf="getLowPriorityTasks(completedTasks).length === 0" class="text-slate-500 text-xs italic text-center py-4">No completed low priority tasks.</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Task Card Template -->
            <ng-template #taskCardTemplate let-tasks>
              <div *ngFor="let task of tasks"
                   class="task-card bg-[#131B2F] rounded-2xl border border-white/5 hover:border-white/20 cursor-pointer group flex flex-col min-h-[140px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 relative overflow-hidden"
                   (click)="openTaskDetail(task)">
                <!-- Priority Indicator Line -->
                <div class="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
                     [class.bg-red-500]="isHighPriority(task)"
                     [class.bg-amber-400]="isMediumPriority(task)"
                     [class.bg-slate-600]="isLowPriority(task)">
                </div>
                <div class="p-4 pl-5 flex-1 flex flex-col">
                  <!-- Header -->
                  <div class="flex justify-between items-start mb-2.5">
                    <span class="text-white font-bold text-sm" [class.line-through]="task.status === 'COMPLETED'">Room {{ task.roomToken }}</span>
                    
                    <!-- Status Badge -->
                    <span *ngIf="task.status === 'NEW' || !task.status" class="bg-red-500/15 text-red-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-red-500/20">NEW</span>
                    <span *ngIf="task.status === 'ACCEPTED'" class="bg-amber-500/15 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-500/20">ACCEPTED</span>
                    <span *ngIf="task.status === 'IN_PROGRESS'" class="bg-blue-500/15 text-blue-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-500/20">IN PROGRESS</span>
                    <span *ngIf="task.status === 'COMPLETED'" class="text-teal-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg></span>
                  </div>
                  
                  <!-- Timestamps -->
                  <div class="flex justify-between items-center mb-2 text-[9px] text-slate-500 font-bold tracking-wider uppercase">
                     <span *ngIf="task.createdAt" class="flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                       {{ task.createdAt | date:'shortTime' }}
                     </span>
                     <span *ngIf="task.acceptedAt" class="flex items-center gap-1 text-amber-500/70">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                       {{ task.acceptedAt | date:'shortTime' }}
                     </span>
                  </div>

                  <span class="inline-block bg-white/10 w-fit text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">{{ task.type || 'Service' }}</span>
                  <p class="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{{ task.description || task.content }}</p>
                  
                  <!-- Actions / Staff Info -->
                  <div class="mt-auto pt-3 border-t border-white/5">
                    <!-- If New: Assign Staff -->
                    <select *ngIf="(task.status === 'NEW' || !task.status)" #staffSelect
                            (change)="assignStaff(task, staffSelect.value); $event.stopPropagation()"
                            (click)="$event.stopPropagation()"
                            class="w-full bg-[#0B1120] border border-white/10 text-slate-300 text-xs rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 block p-2 outline-none transition-all duration-300 hover:border-white/20">
                      <option disabled selected>Assign to available staff...</option>
                      <option *ngFor="let staff of idleStaffNames" [value]="staff">{{ staff }}</option>
                      <option *ngIf="idleStaffNames.length === 0" disabled>No staff currently available</option>
                    </select>

                    <!-- If Accepted: Show Assigned Staff -->
                    <div *ngIf="task.status === 'ACCEPTED'" class="flex flex-col gap-2">
                      <div class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-2.5 py-2">
                        <div class="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <span class="text-indigo-300 text-[10px] font-black">{{ task.staffName?.charAt(0) }}</span>
                        </div>
                        <span class="text-slate-300 text-xs font-medium truncate">{{ task.staffName }}</span>
                      </div>
                    </div>

                    <!-- If In Progress: Show Working Staff -->
                    <div *ngIf="task.status === 'IN_PROGRESS'" class="flex flex-col gap-2">
                      <div class="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 rounded-lg px-2.5 py-2">
                        <div class="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <span class="text-blue-300 text-[10px] font-black">{{ task.staffName?.charAt(0) }}</span>
                        </div>
                        <span class="text-slate-400 text-xs">Working: <span class="text-slate-200 font-semibold">{{ task.staffName }}</span></span>
                      </div>
                    </div>

                    <!-- If Completed: Show staff -->
                    <div *ngIf="task.status === 'COMPLETED'" class="flex items-center gap-2 text-slate-500 text-xs">
                      <span class="font-bold">Done by:</span> {{ task.staffName || 'Staff' }}
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>

          </div><!-- /Tabbed Main Content -->
        </div><!-- /Content row -->

      <!-- ═══════════════ TASK DETAIL MODAL ═══════════════ -->
      <div *ngIf="selectedTask" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" (click)="selectedTask = null">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-[440px] max-w-[95vw] overflow-hidden" (click)="$event.stopPropagation()">

          <div class="p-5 border-b border-slate-800 flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border"
                      [ngClass]="isHighPriority(selectedTask) ? 'text-red-400 bg-red-500/15 border-red-500/30' : isMediumPriority(selectedTask) ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' : 'text-slate-400 bg-slate-700 border-slate-600'">
                  {{ isHighPriority(selectedTask) ? 'High Priority' : isMediumPriority(selectedTask) ? 'Medium Priority' : 'Low Priority' }}
                </span>
              </div>
              <h2 class="font-black text-white text-xl leading-tight">Room {{ selectedTask.roomToken }}</h2>
            </div>
            <button (click)="selectedTask = null"
                    class="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-800 rounded-xl p-3.5 border border-slate-700">
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Service Type</p>
                <p class="text-white font-bold text-sm">{{ selectedTask.type || 'Service' }}</p>
              </div>
              <div class="bg-slate-800 rounded-xl p-3.5 border border-slate-700">
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <p class="font-black text-sm"
                   [ngClass]="selectedTask.status === 'NEW' ? 'text-red-400' : selectedTask.status === 'ACCEPTED' ? 'text-amber-400' : selectedTask.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-teal-400'">
                  {{ selectedTask.status }}
                </p>
              </div>
              <div *ngIf="selectedTask.createdAt" class="bg-slate-800 rounded-xl p-3.5 border border-slate-700">
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Submitted At</p>
                <p class="text-white font-bold text-sm flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                  {{ selectedTask.createdAt | date:'shortTime' }}
                </p>
              </div>
              <div *ngIf="selectedTask.acceptedAt" class="bg-slate-800 rounded-xl p-3.5 border border-slate-700">
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Accepted At</p>
                <p class="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  {{ selectedTask.acceptedAt | date:'shortTime' }}
                </p>
              </div>
            </div>

            <div *ngIf="selectedTask.staffName" class="bg-slate-800 rounded-xl p-3.5 border border-slate-700 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300">
                {{ selectedTask.staffName.charAt(0) }}
              </div>
              <div>
                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</p>
                <p class="text-white font-bold text-sm">{{ selectedTask.staffName }}</p>
              </div>
            </div>

            <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description / Instructions</p>
              <p class="text-slate-300 text-sm leading-relaxed">{{ selectedTask.description || 'No description provided.' }}</p>
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-3 mt-4">
              <button (click)="selectedTask = null"
                      class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-bold py-2.5 px-5 rounded-xl transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /root -->
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :host { display: block; height: 100vh; overflow: hidden; }

    .task-card {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      animation: slideIn 0.25s ease;
    }
    .task-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.5); }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Thin custom scrollbar */
    ::-webkit-scrollbar       { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `]
})
export class AdminRequestsComponent implements OnInit, OnDestroy {
  // Kanban columns
  incomingTasks: any[]  = [];
  acceptedTasks: any[]  = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];

  // UI state
  activeScreen: 'new_accepted' | 'in_progress' | 'completed' = 'new_accepted';
  selectedTask: any = null;
  isConnected: boolean = false;

  // Staff
  staffList: string[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(private wsService: WebsocketService, private http: HttpClient) {}

  get newAndAcceptedTasks(): any[] {
    return [...this.incomingTasks, ...this.acceptedTasks];
  }

  getHighPriorityTasks(tasks: any[]): any[] {
    return tasks.filter(t => this.isHighPriority(t));
  }
  getMediumPriorityTasks(tasks: any[]): any[] {
    return tasks.filter(t => this.isMediumPriority(t));
  }
  getLowPriorityTasks(tasks: any[]): any[] {
    return tasks.filter(t => this.isLowPriority(t));
  }

  get idleStaffNames(): string[] {
    return this.staffList.filter(name => this.getStaffLoad(name) === 0);
  }

  ngOnInit(): void {
    // Fetch Staff Members
    this.http.get<any[]>('http://localhost:8082/api/auth/staff').subscribe(staff => {
      this.staffList = staff.map(s => s.username);
    });

    // Fetch initial Tasks
    this.http.get<any[]>('http://localhost:8082/api/requests/all').subscribe(tasks => {
      tasks.forEach(t => {
        t.roomToken = t.room?.token || t.roomToken;
        t.staffName = t.staff?.username || t.staffName;
      });
      this.incomingTasks  = this.sortTasks(tasks.filter(t => t.status === 'NEW' || !t.status));
      this.acceptedTasks  = this.sortTasks(tasks.filter(t => t.status === 'ACCEPTED'));
      this.inProgressTasks = this.sortTasks(tasks.filter(t => t.status === 'IN_PROGRESS'));
      this.completedTasks = this.sortTasks(tasks.filter(t => t.status === 'COMPLETED'));
    });

    // WebSocket connection
    this.wsService.connect();

    // Track connection state via the service's BehaviorSubject
    this.subscriptions.add(
      this.wsService.getConnectionState().subscribe(state => {
        this.isConnected = state;
      })
    );

    // Task updates
    this.subscriptions.add(
      this.wsService.getTaskUpdates().subscribe(task => {
        this.processIncomingUpdate(task);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openTaskDetail(task: any): void {
    this.selectedTask = task;
  }

  isHighPriority(task: any): boolean {
    return task.priority === 'HIGH' || task.description?.includes('HIGH');
  }

  isMediumPriority(task: any): boolean {
    return task.priority === 'MEDIUM' || task.description?.includes('MEDIUM');
  }

  isLowPriority(task: any): boolean {
    return !this.isHighPriority(task) && !this.isMediumPriority(task);
  }

  sortTasks(tasks: any[]): any[] {
    return tasks.sort((a, b) => {
      const pA = this.isHighPriority(a) ? 3 : this.isMediumPriority(a) ? 2 : 1;
      const pB = this.isHighPriority(b) ? 3 : this.isMediumPriority(b) ? 2 : 1;
      return pB - pA;
    });
  }

  getStaffLoad(staffName: string): number {
    return this.acceptedTasks.filter(t => t.staffName === staffName).length
         + this.inProgressTasks.filter(t => t.staffName === staffName).length;
  }

  playHighPriorityAlert(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const play = (f: number, t: number, d: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + d);
      };
      const now = ctx.currentTime;
      play(880, now, 0.2);
      play(880, now + 0.22, 0.2);
      play(1046.5, now + 0.44, 0.4);
    } catch (e) {
      console.error('Audio failed', e);
    }
  }

  processIncomingUpdate(task: any): void {
    if (task.status === 'NEW' || !task.status) {
      if (task.id) {
        if (!this.incomingTasks.find(t => t.id === task.id)) {
          this.pushToCorrectArray(task);
          if (task.priority === 'HIGH') this.playHighPriorityAlert();
        }
      } else {
        if (!this.incomingTasks.find(t => t.roomToken === task.roomToken && t.type === task.type)) {
          this.pushToCorrectArray(task);
          if (task.priority === 'HIGH') this.playHighPriorityAlert();
        }
      }
      return;
    }

    let existingTask: any = null;
    if (task.id) {
      existingTask = this.incomingTasks.find(t => t.id === task.id)
                 || this.acceptedTasks.find(t => t.id === task.id)
                 || this.inProgressTasks.find(t => t.id === task.id);
    }
    if (!existingTask) {
      existingTask = [
        ...this.incomingTasks,
        ...this.acceptedTasks,
        ...this.inProgressTasks
      ].find(t => t.roomToken === task.roomToken) ?? null;
    }

    if (existingTask) {
      this.removeTaskFromAllArrays(existingTask);
      existingTask.status = task.status;
      if (task.staffName) existingTask.staffName = task.staffName;
      this.pushToCorrectArray(existingTask);
    } else {
      this.pushToCorrectArray(task);
    }
  }

  assignStaff(task: any, staffName: string): void {
    if (!task.roomToken) return;
    this.removeTaskFromAllArrays(task);
    task.status   = 'ACCEPTED';
    task.staffName = staffName;
    this.pushToCorrectArray(task);
    this.wsService.assignStaff(task.roomToken, staffName, task.id);
  }

  updateStatus(task: any, status: string): void {
    if (!task.roomToken) return;
    this.removeTaskFromAllArrays(task);
    task.status = status;
    this.pushToCorrectArray(task);
    this.wsService.updateTaskStatus(task.roomToken, status, task.id);
  }

  private removeTaskFromAllArrays(task: any): void {
    this.incomingTasks   = this.incomingTasks.filter(t => t !== task);
    this.acceptedTasks   = this.acceptedTasks.filter(t => t !== task);
    this.inProgressTasks  = this.inProgressTasks.filter(t => t !== task);
    this.completedTasks  = this.completedTasks.filter(t => t !== task);
  }

  private pushToCorrectArray(task: any): void {
    if      (task.status === 'ACCEPTED')    this.acceptedTasks   = this.sortTasks([task, ...this.acceptedTasks]);
    else if (task.status === 'IN_PROGRESS') this.inProgressTasks  = this.sortTasks([task, ...this.inProgressTasks]);
    else if (task.status === 'COMPLETED')   this.completedTasks  = this.sortTasks([task, ...this.completedTasks]);
    else                                    this.incomingTasks   = this.sortTasks([task, ...this.incomingTasks]);
  }
}
