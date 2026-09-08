import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen bg-slate-950 overflow-hidden" style="font-family: 'Inter', system-ui, sans-serif;">

      <!-- ═══════════════ LEFT SIDEBAR ═══════════════ -->
      <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-10">

        <!-- Logo -->
        <div class="p-5 border-b border-slate-800 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-teal-500/30 to-teal-600/10 rounded-xl border border-teal-500/30 flex items-center justify-center">
            <span class="text-teal-400 font-black text-xl">V</span>
          </div>
          <div>
            <h1 class="text-white font-black text-xl tracking-tight">Villora</h1>
            <p class="text-teal-400 text-[9px] font-bold tracking-[0.2em] uppercase">Hotel Management</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <p class="text-slate-600 text-[9px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>

          <a routerLink="/admin/dashboard" routerLinkActive="bg-teal-500/10 text-teal-300 border border-teal-500/20"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-400 hover:text-white hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Dashboard
          </a>

          <a routerLink="/admin/requests" routerLinkActive="bg-teal-500/10 text-teal-300 border border-teal-500/20"
             [routerLinkActiveOptions]="{ exact: false }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-400 hover:text-white hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Requests
          </a>

          <a routerLink="/admin/analytics" routerLinkActive="bg-teal-500/10 text-teal-300 border border-teal-500/20"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-400 hover:text-white hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Analytics
          </a>
        </nav>

        <!-- Bottom: Connection status + User -->
        <div class="p-4 border-t border-slate-800 space-y-3">
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
               [ngClass]="isConnected ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-red-500/10 border border-red-500/20'">
            <div class="w-2 h-2 rounded-full"
                 [ngClass]="isConnected ? 'bg-teal-400 live-pulse' : 'bg-red-400'"></div>
            <span class="text-[10px] font-bold uppercase tracking-wider"
                  [ngClass]="isConnected ? 'text-teal-400' : 'text-red-400'">
              {{ isConnected ? 'Live Connection' : 'Disconnected' }}
            </span>
          </div>
          <div class="flex items-center gap-3 px-1">
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" class="w-9 h-9 rounded-full border-2 border-teal-500/50">
            <div>
              <p class="text-sm font-bold text-white leading-tight">Admin User</p>
              <p class="text-[10px] text-slate-500 font-medium">System Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- ═══════════════ PAGE CONTENT (child routes render here) ═══════════════ -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <router-outlet></router-outlet>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    :host { display: block; height: 100vh; overflow: hidden; }

    .live-pulse {
      animation: livePulse 2s ease-in-out infinite;
    }
    @keyframes livePulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
      50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
    }

    ::-webkit-scrollbar       { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `]
})
export class AdminLayoutComponent {
  isConnected = false;
  private sub: Subscription;

  constructor(private wsService: WebsocketService) {
    this.wsService.connect();
    this.sub = this.wsService.getConnectionState().subscribe(state => {
      this.isConnected = state;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
