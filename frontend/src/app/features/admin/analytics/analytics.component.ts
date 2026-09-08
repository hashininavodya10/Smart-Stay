import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';

interface RecentActivity {
  id: number;
  roomToken: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface AnalyticsData {
  totalRequestsToday: number;
  avgResolutionMinutes: number;
  highPriorityLast24h: number;
  totalStaff: number;
  totalAllTimeRequests: number;
  categoryBreakdown: { [key: string]: number };
  recentHighPriority: RecentActivity[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  HOUSEKEEPING: '#6366f1',
  MEALS:        '#f59e0b',
  MAINTENANCE:  '#10b981',
  SECURITY:     '#ef4444',
};

const CATEGORY_LABELS: { [key: string]: string } = {
  HOUSEKEEPING: 'Housekeeping',
  MEALS:        'Dining / Meals',
  MAINTENANCE:  'Maintenance',
  SECURITY:     'Security',
};

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-root flex flex-col h-full overflow-y-auto" style="font-family:'Inter',system-ui,sans-serif; background:#0B1120; color:#e2e8f0;">

      <!-- Header -->
      <header class="px-8 pt-8 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <div>
          <h2 class="text-2xl font-black text-white tracking-tight">Service Analytics</h2>
          <p class="text-slate-400 text-xs mt-0.5">Live overview of hotel service operations</p>
        </div>
        <!-- Live indicator -->
        <div class="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
          Live
        </div>
      </header>

      <!-- Loading state -->
      <div *ngIf="loading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
          <p class="text-slate-400 text-sm">Loading analytics...</p>
        </div>
      </div>

      <!-- Error state -->
      <div *ngIf="error && !loading" class="flex-1 flex items-center justify-center">
        <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-sm">
          <p class="text-red-400 font-bold mb-2">Could not load analytics</p>
          <p class="text-slate-500 text-sm mb-4">Make sure the backend is running on port 8082.</p>
          <button (click)="loadAnalytics()"
                  class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all">
            Retry
          </button>
        </div>
      </div>

      <!-- Main content -->
      <main *ngIf="!loading && !error && analytics" class="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <!-- Total Requests Today -->
          <div class="kpi-card rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-2 hover:border-indigo-500/30 transition-all">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Requests Today</span>
              <div class="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black text-white">{{ analytics.totalRequestsToday }}</p>
            <p class="text-xs text-slate-500">
              {{ analytics.totalAllTimeRequests }} total all-time
            </p>
          </div>

          <!-- Avg Resolution Time -->
          <div class="kpi-card rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-2 hover:border-emerald-500/30 transition-all">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Resolution</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black text-white">
              {{ analytics.avgResolutionMinutes }}<span class="text-xl text-slate-400 font-medium ml-1">min</span>
            </p>
            <p class="text-xs text-slate-500" *ngIf="analytics.avgResolutionMinutes > 0">Avg time from submit → accept</p>
            <p class="text-xs text-slate-500" *ngIf="analytics.avgResolutionMinutes === 0">No resolved requests yet</p>
          </div>

          <!-- High Priority Last 24h -->
          <div class="kpi-card rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-2 hover:border-red-500/30 transition-all">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">High Priority (24h)</span>
              <div class="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black text-red-400">{{ analytics.highPriorityLast24h }}</p>
            <p class="text-xs text-slate-500">Critical requests in last 24 hours</p>
          </div>

          <!-- Staff Count -->
          <div class="kpi-card rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-2 hover:border-violet-500/30 transition-all">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Staff</span>
              <div class="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
            </div>
            <p class="text-4xl font-black text-violet-400">{{ analytics.totalStaff }}</p>
            <p class="text-xs text-slate-500">Registered staff members</p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <!-- Requests by Category -->
          <div class="bg-white/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
            <h3 class="font-bold text-slate-200 mb-1 text-base">Requests by Category</h3>
            <p class="text-slate-500 text-xs mb-5">All-time distribution across service types</p>

            <div *ngIf="categoryRows.length === 0" class="text-slate-500 text-sm italic py-4 text-center">
              No requests yet.
            </div>

            <div class="space-y-4">
              <div *ngFor="let row of categoryRows">
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="font-semibold text-slate-300 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full inline-block" [style.background]="row.color"></span>
                    {{ row.label }}
                  </span>
                  <span class="text-slate-400 font-bold">{{ row.count }} <span class="text-slate-600 font-normal">({{ row.pct }}%)</span></span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-700"
                       [style.width]="row.pct + '%'"
                       [style.background]="row.color">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent High Priority Activity -->
          <div class="bg-white/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
            <h3 class="font-bold text-slate-200 mb-1 text-base">Recent High Priority Activity</h3>
            <p class="text-slate-500 text-xs mb-5">Last 24 hours — most recent first</p>

            <div *ngIf="analytics.recentHighPriority.length === 0"
                 class="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <p class="text-slate-400 text-sm font-medium">All clear!</p>
              <p class="text-slate-600 text-xs">No high priority requests in the last 24 hours.</p>
            </div>

            <ul class="space-y-3">
              <li *ngFor="let item of analytics.recentHighPriority"
                  class="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-red-500/20 transition-all">
                <div class="shrink-0 mt-0.5">
                  <div class="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                    <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <p class="text-sm font-bold text-white truncate">Room {{ item.roomToken }}</p>
                    <span class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border"
                          [ngClass]="{
                            'bg-red-500/15 text-red-400 border-red-500/20': item.status === 'NEW',
                            'bg-amber-500/15 text-amber-400 border-amber-500/20': item.status === 'ACCEPTED',
                            'bg-blue-500/15 text-blue-400 border-blue-500/20': item.status === 'IN_PROGRESS',
                            'bg-teal-500/15 text-teal-400 border-teal-500/20': item.status === 'COMPLETED'
                          }">
                      {{ item.status }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 truncate mb-1">{{ item.description || 'No description' }}</p>
                  <p class="text-[10px] text-slate-600 font-medium">{{ item.createdAt | date:'MMM d, h:mm a' }}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    :host { display: block; height: 100%; overflow: hidden; }
    .analytics-root { min-height: 100%; }
    .kpi-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
  `]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  analytics: AnalyticsData | null = null;
  categoryRows: { key: string; label: string; color: string; count: number; pct: number }[] = [];
  loading = true;
  error = false;

  private subscriptions = new Subscription();

  constructor(private http: HttpClient, private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.loadAnalytics();

    // Connect WS if not already connected
    this.wsService.connect();

    // Auto-refresh whenever a new task comes in via WebSocket
    this.subscriptions.add(
      this.wsService.getTaskUpdates().subscribe(() => {
        this.loadAnalytics();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadAnalytics(): void {
    this.error = false;
    this.http.get<AnalyticsData>('http://localhost:8082/api/analytics').subscribe({
      next: (data) => {
        this.analytics = data;
        this.buildCategoryRows(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  private buildCategoryRows(data: AnalyticsData): void {
    const breakdown = data.categoryBreakdown || {};
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
    this.categoryRows = Object.entries(breakdown).map(([key, count]) => ({
      key,
      label: CATEGORY_LABELS[key] ?? key,
      color: CATEGORY_COLORS[key] ?? '#94a3b8',
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    })).sort((a, b) => b.count - a.count);
  }
}
