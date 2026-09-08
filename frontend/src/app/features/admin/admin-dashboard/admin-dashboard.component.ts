import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full overflow-hidden bg-[#0B1120]" style="font-family: 'Inter', system-ui, sans-serif;">

        <!-- Top Header Bar -->
        <header class="bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
          <div>
            <h2 class="text-xl font-black text-white tracking-tight">Operations Dashboard</h2>
            <p class="text-slate-400 text-xs mt-0.5 tracking-wide">Real-time service request management · Villora Hotel</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Operations Buttons -->
            <div class="flex items-center gap-2 mr-2 border-r border-white/5 pr-4">
              <button (click)="downloadPerformancePDF()"
                      class="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 border border-white/5 hover:border-white/10 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Export PDF
              </button>
            </div>
            <!-- Search bar -->
            <div class="relative bg-white/5 border border-white/5 hover:border-white/10 rounded-xl flex items-center px-3 py-2 focus-within:border-teal-500/60 focus-within:bg-white/10 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" placeholder="Search rooms, tasks..." class="bg-transparent border-none outline-none text-sm text-slate-200 ml-2 w-44 placeholder-slate-500">
            </div>
            <!-- Notification bell -->
            <button class="relative bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl p-2.5 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span *ngIf="incomingTasks.length > 0"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-md shadow-red-500/30">
                {{ incomingTasks.length }}
              </span>
            </button>
          </div>
        </header>

        <!-- KPI Strip -->
        <div class="grid grid-cols-5 gap-3 px-6 pt-5 pb-4 shrink-0">

          <!-- Total Requests -->
          <div class="kpi-card bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 hover:bg-white/10 hover:-translate-y-0.5 shadow-lg shadow-black/20 transition-all duration-300 cursor-default">
            <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Total Today</p>
              <p class="text-white text-2xl font-black leading-tight">{{ incomingTasks.length + acceptedTasks.length + inProgressTasks.length + completedTasks.length }}</p>
            </div>
          </div>

          <!-- Pending -->
          <div class="kpi-card bg-white/5 backdrop-blur-md border border-red-500/10 rounded-2xl p-4 flex items-center gap-3 hover:border-red-500/20 hover:bg-red-500/5 hover:-translate-y-0.5 shadow-lg shadow-black/20 transition-all duration-300 cursor-default">
            <div class="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Pending</p>
              <p class="text-red-400 text-2xl font-black leading-tight">{{ incomingTasks.length }}</p>
            </div>
          </div>

          <!-- Accepted -->
          <div class="kpi-card bg-white/5 backdrop-blur-md border border-amber-500/10 rounded-2xl p-4 flex items-center gap-3 hover:border-amber-500/20 hover:bg-amber-500/5 hover:-translate-y-0.5 shadow-lg shadow-black/20 transition-all duration-300 cursor-default">
            <div class="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Accepted</p>
              <p class="text-amber-400 text-2xl font-black leading-tight">{{ acceptedTasks.length }}</p>
            </div>
          </div>

          <!-- In Progress -->
          <div class="kpi-card bg-white/5 backdrop-blur-md border border-blue-500/10 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-500/20 hover:bg-blue-500/5 hover:-translate-y-0.5 shadow-lg shadow-black/20 transition-all duration-300 cursor-default">
            <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">In Progress</p>
              <p class="text-blue-400 text-2xl font-black leading-tight">{{ inProgressTasks.length }}</p>
            </div>
          </div>

          <!-- Completed -->
          <div class="kpi-card bg-white/5 backdrop-blur-md border border-teal-500/10 rounded-2xl p-4 flex items-center gap-3 hover:border-teal-500/20 hover:bg-teal-500/5 hover:-translate-y-0.5 shadow-lg shadow-black/20 transition-all duration-300 cursor-default">
            <div class="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center shrink-0 border border-teal-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Completed</p>
              <p class="text-teal-400 text-2xl font-black leading-tight">{{ completedTasks.length }}</p>
            </div>
          </div>

        </div>

        <!-- Kanban + Activity Feed Row -->
        <div class="flex-1 flex gap-4 px-6 pb-6 overflow-hidden min-h-0">

                    <!-- ─── Staff Overview Main Content ─── -->
          <div class="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
            <div class="px-5 pt-5 flex justify-between items-center shrink-0">
              <div>
                <h2 class="font-black text-white text-lg">Staff Overview</h2>
                <p class="text-slate-500 text-xs mt-0.5">{{ availableStaff.length }} members · Live workload</p>
              </div>
            </div>

            <!-- Tabs -->
            <div class="flex bg-slate-950/50 p-1 mx-5 mt-2 rounded-xl gap-1 shrink-0 w-fit">
              <button (click)="dashboardTab = 'availability'"
                      [ngClass]="dashboardTab === 'availability' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                      class="px-5 py-2 text-xs font-bold rounded-lg transition-all">Availability</button>
              <button (click)="dashboardTab = 'performance'"
                      [ngClass]="dashboardTab === 'performance' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                      class="px-5 py-2 text-xs font-bold rounded-lg transition-all">Performance</button>
            </div>

            <div class="p-5 flex flex-col gap-3 flex-1 overflow-y-auto custom-scroll">
              <!-- Availability Tab -->
              <ng-container *ngIf="dashboardTab === 'availability'">
                <div *ngFor="let staff of availableStaff"
                     class="flex flex-col gap-2 p-3.5 rounded-xl border transition-all"
                     [ngClass]="staff.load === 0 ? 'bg-teal-500/5 border-teal-500/20' : 'bg-slate-800 border-slate-700'">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0"
                         [ngClass]="staff.load === 0 ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-700 text-slate-300 border-slate-600'">
                      {{ staff.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-white text-sm truncate">{{ staff.name.split(' (')[0] }}</p>
                      <p class="text-slate-500 text-[10px] uppercase tracking-wider">{{ staff.name.split(' (')[1]?.replace(')', '') || 'Staff' }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-1.5 shrink-0">
                      <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border"
                            [ngClass]="staff.load === 0 ? 'bg-teal-500/15 text-teal-400 border-teal-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'">
                        {{ staff.load === 0 ? 'Available' : staff.load + ' Task' + (staff.load > 1 ? 's' : '') }}
                      </span>
                      <!-- Workload bar -->
                      <div class="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             [ngClass]="staff.load === 0 ? 'bg-teal-400' : staff.load === 1 ? 'bg-amber-400' : 'bg-red-400'"
                             [style.width]="Math.min(staff.load / 3 * 100, 100) + '%'"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Assigned Tasks List -->
                  <div *ngIf="staff.tasks && staff.tasks.length > 0" class="mt-2 pt-2 border-t border-slate-700/50 flex flex-col gap-1.5">
                    <div *ngFor="let task of staff.tasks" class="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                       <div class="flex items-center gap-2">
                         <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{{ task.type || 'Service' }}</span>
                         <span class="text-xs text-slate-400">Room {{ task.roomToken }}</span>
                       </div>
                       <span class="text-[9px] font-bold uppercase" [ngClass]="task.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-amber-400'">
                         {{ task.status === 'IN_PROGRESS' ? 'Active' : 'Queued' }}
                       </span>
                    </div>
                  </div>
                </div>
              </ng-container>

              <!-- Performance Tab -->
              <ng-container *ngIf="dashboardTab === 'performance'">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Leaderboard</h3>
                  <button (click)="downloadPerformancePDF()"
                          class="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border border-indigo-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Export PDF
                  </button>
                </div>
                <div *ngFor="let staff of staffPerformanceList; let i = index"
                     class="p-3.5 rounded-xl border border-slate-700 bg-slate-800">
                  <div class="flex justify-between items-center mb-2.5">
                    <div class="flex items-center gap-2.5">
                      <span class="text-lg w-7 text-center leading-none">{{ i === 0 && staff.completed > 0 ? '🏆' : i === 1 && staff.completed > 0 ? '🥈' : i === 2 && staff.completed > 0 ? '🥉' : '' }}</span>
                      <span class="font-bold text-white text-sm">{{ staff.name.split(' (')[0] }}</span>
                    </div>
                    <span class="text-xs font-black px-2.5 py-0.5 rounded-full"
                          [ngClass]="staff.completed > 0 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-500'">
                      {{ staff.completed }} Done
                    </span>
                  </div>
                  <div class="w-full bg-slate-700 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full transition-all duration-700"
                         [ngClass]="i === 0 ? 'bg-teal-400' : i === 1 ? 'bg-slate-300' : i === 2 ? 'bg-amber-600' : 'bg-indigo-400'"
                         [style.width.%]="staff.completed > 0 ? staff.percentage : 0"></div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div><!-- /Staff Overview Main Content -->

          <!-- ─── Activity Feed ─── -->
          <aside class="w-[300px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl shrink-0 overflow-hidden">

            <!-- Feed Header -->
            <div class="p-4 border-b border-slate-800 shrink-0">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-white text-sm">Activity Feed</h3>
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-teal-400 live-pulse"></div>
                  <span class="text-teal-400 text-[9px] font-bold uppercase tracking-wider">Live</span>
                </div>
              </div>
              <!-- Tabs -->
              <div class="flex bg-slate-800/80 rounded-xl p-1 gap-1">
                <button (click)="feedTab = 'all'"
                        [ngClass]="feedTab === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                        class="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all uppercase tracking-wider">All</button>
                <button (click)="feedTab = 'chats'"
                        [ngClass]="feedTab === 'chats' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                        class="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all uppercase tracking-wider">Chats</button>
                <button (click)="feedTab = 'updates'"
                        [ngClass]="feedTab === 'updates' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                        class="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all uppercase tracking-wider">Updates</button>
              </div>
            </div>

            <!-- Feed Entries -->
            <div class="flex-1 p-3 overflow-y-auto space-y-2.5">

              <div *ngIf="filteredFeed.length === 0" class="flex flex-col items-center justify-center py-10 text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p class="text-xs font-semibold">No activity yet</p>
              </div>

              <ng-container *ngFor="let entry of filteredFeed">

                <!-- Chat bubble entry -->
                <div *ngIf="entry.type === 'chat'" class="feed-item flex gap-2.5">
                  <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5 border"
                       [ngClass]="entry.sender === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'">
                    {{ entry.sender === 'ADMIN' ? 'A' : 'G' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-1">
                      <span class="text-[10px] font-bold"
                            [ngClass]="entry.sender === 'ADMIN' ? 'text-indigo-400' : 'text-emerald-400'">
                        {{ entry.sender === 'ADMIN' ? 'You (Admin)' : 'Room ' + entry.roomToken }}
                      </span>
                    </div>
                    <div class="text-slate-300 text-xs leading-relaxed bg-slate-800 rounded-xl px-3 py-2 border border-slate-700/60">
                      {{ entry.content }}
                    </div>
                  </div>
                </div>

                <!-- Status update entry -->
                <div *ngIf="entry.type === 'update'" class="feed-item flex gap-2.5">
                  <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 border"
                       [ngClass]="entry.status === 'COMPLETED' ? 'bg-teal-500/20 border-teal-500/30' : entry.status === 'IN_PROGRESS' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-amber-500/20 border-amber-500/30'">
                    <svg *ngIf="entry.status === 'COMPLETED'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <svg *ngIf="entry.status === 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <svg *ngIf="entry.status !== 'COMPLETED' && entry.status !== 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div class="flex-1 min-w-0 bg-slate-800/60 rounded-xl px-3 py-2 border border-slate-700/40">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="text-slate-400 text-[10px] font-bold">Room {{ entry.roomToken }}</span>
                      <span class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                            [ngClass]="entry.status === 'COMPLETED' ? 'bg-teal-500/20 text-teal-400' : entry.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'">
                        {{ entry.status }}
                      </span>
                    </div>
                    <p class="text-slate-500 text-[11px] leading-relaxed truncate">{{ entry.content }}</p>
                  </div>
                </div>

              </ng-container>
            </div>

            <!-- Chat Reply Input -->
            <div class="p-3 border-t border-slate-800 shrink-0">
              <div class="flex gap-2">
                <input type="text"
                       [(ngModel)]="adminMessage"
                       (keyup.enter)="sendAdminMessage()"
                       placeholder="Reply to all rooms..."
                       class="flex-1 bg-slate-800 border border-slate-700 text-sm text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600 min-w-0">
                <button (click)="sendAdminMessage()"
                        class="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 transition-all shadow-lg shadow-indigo-500/10 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </div>
            </div>

          </aside><!-- /Activity Feed -->

        </div><!-- /Content row -->

      </div><!-- /root -->
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :host { display: block; height: 100vh; overflow: hidden; }

    .kpi-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

    .task-card {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      animation: slideIn 0.25s ease;
    }
    .task-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.5); }

    .feed-item { animation: fadeInUp 0.2s ease; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .live-pulse {
      animation: livePulse 2s ease-in-out infinite;
    }
    @keyframes livePulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
      50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
    }

    /* Thin custom scrollbar */
    ::-webkit-scrollbar       { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // Kanban columns
  incomingTasks: any[]  = [];
  acceptedTasks: any[]  = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];

  // UI state
  
  
  dashboardTab: 'availability' | 'performance' = 'availability';
  
  feedTab: 'all' | 'chats' | 'updates' = 'all';
  isConnected: boolean = false;

  // Expose Math for template
  Math = Math;

  // Staff
  staffList: string[] = [];

  // Activity feed (unified: chats + task status events)
  activityFeed: any[] = [];

  // Chat
  adminMessage: string = '';
  private activeChatRooms: Set<string> = new Set<string>();

  private subscriptions: Subscription = new Subscription();

  constructor(private wsService: WebsocketService, private http: HttpClient) {}

  // ─── Computed ───────────────────────────────────────────────────

  get filteredFeed(): any[] {
    if (this.feedTab === 'chats')   return this.activityFeed.filter(e => e.type === 'chat');
    if (this.feedTab === 'updates') return this.activityFeed.filter(e => e.type === 'update');
    return this.activityFeed;
  }

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

  get availableStaff(): { name: string; load: number; tasks: any[] }[] {
    return this.staffList
      .map(name => {
        const assignedTasks = [
          ...this.acceptedTasks.filter(t => t.staffName === name),
          ...this.inProgressTasks.filter(t => t.staffName === name)
        ];
        return { name, load: assignedTasks.length, tasks: assignedTasks };
      })
      .sort((a, b) => b.load - a.load);
  }

  get staffPerformanceList(): { name: string; completed: number; percentage: number }[] {
    const stats = this.staffList.map(name => ({ name, completed: this.getStaffPerformance(name) }));
    const max = Math.max(...stats.map(s => s.completed), 1);
    return stats
      .map(s => ({ ...s, percentage: (s.completed / max) * 100 }))
      .sort((a, b) => b.completed - a.completed);
  }

  get activeRooms(): string[] {
    const rooms = new Set<string>();
    [...this.incomingTasks, ...this.acceptedTasks, ...this.inProgressTasks]
      .forEach(t => { if (t.roomToken) rooms.add(t.roomToken); });
    return Array.from(rooms);
  }

  // ─── Lifecycle ──────────────────────────────────────────────────

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

    // Load existing chats
    this.http.get<any[]>('http://localhost:8082/api/chats/all').subscribe(chats => {
      chats.forEach(chat => {
        const entry = {
          type: 'chat',
          roomToken: chat.room?.token,
          sender: chat.sender?.role === 'ADMIN' ? 'ADMIN' : 'GUEST',
          content: chat.content
        };
        this.activityFeed.unshift(entry);
        if (entry.roomToken && entry.sender === 'GUEST') {
          this.activeChatRooms.add(entry.roomToken);
        }
      });
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
        if (task.status && task.status !== 'NEW') {
          const entry = {
            type: 'update',
            roomToken: task.roomToken,
            status: task.status,
            content: `${task.type || 'Request'} — changed to ${task.status}${task.staffName ? ' by ' + task.staffName : ''}`
          };
          this.activityFeed = [entry, ...this.activityFeed].slice(0, 150);
        }
      })
    );

    // Chat messages
    this.subscriptions.add(
      this.wsService.getChatMessages().subscribe(msg => {
        const entry = { ...msg, type: 'chat' };
        this.activityFeed = [entry, ...this.activityFeed].slice(0, 150);
        if (msg.roomToken && msg.sender === 'GUEST') {
          this.activeChatRooms.add(msg.roomToken);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }



  // ─── Priority helpers ───────────────────────────────────────────

  isHighPriority(task: any): boolean {
    return task.priority === 'HIGH' || task.description?.includes('HIGH');
  }

  isMediumPriority(task: any): boolean {
    return task.priority === 'MEDIUM' || task.description?.includes('MEDIUM');
  }

  isLowPriority(task: any): boolean {
    return !this.isHighPriority(task) && !this.isMediumPriority(task);
  }

  getPriorityClasses(task: any): string {
    if (this.isHighPriority(task))   return 'border-l-red-500';
    if (this.isMediumPriority(task)) return 'border-l-amber-400';
    return 'border-l-slate-600';
  }

  sortTasks(tasks: any[]): any[] {
    return tasks.sort((a, b) => {
      const pA = this.isHighPriority(a) ? 3 : this.isMediumPriority(a) ? 2 : 1;
      const pB = this.isHighPriority(b) ? 3 : this.isMediumPriority(b) ? 2 : 1;
      return pB - pA;
    });
  }

  // ─── Staff ──────────────────────────────────────────────────────

  getStaffLoad(staffName: string): number {
    return this.acceptedTasks.filter(t => t.staffName === staffName).length
         + this.inProgressTasks.filter(t => t.staffName === staffName).length;
  }

  getStaffPerformance(staffName: string): number {
    return this.completedTasks.filter(t => t.staffName === staffName).length;
  }

  // ─── PDF Export ─────────────────────────────────────────────────

  downloadPerformancePDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Villora Hotel — Staff Performance Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = this.staffPerformanceList.map((staff, i) => [
      (i + 1).toString(),
      staff.name,
      staff.completed + ' Tasks',
      staff.percentage === 100 && staff.completed > 0 ? 'Top Performer 🏆' : ''
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Rank', 'Staff Member', 'Completed Tasks', 'Notes']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save('villora-staff-performance.pdf');
  }

  // ─── Audio Alert ────────────────────────────────────────────────

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

  // ─── WebSocket Event Processing ─────────────────────────────────

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

  sendAdminMessage(): void {
    const msg = this.adminMessage.trim();
    if (!msg) return;
    const targets = this.activeChatRooms.size > 0
      ? Array.from(this.activeChatRooms)
      : this.activeRooms;
    targets.forEach(room => this.wsService.sendChatMessage(room, msg, 'ADMIN'));
    this.adminMessage = '';
  }

  // ─── Helpers ────────────────────────────────────────────────────

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
