import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[100dvh] relative flex flex-col justify-center items-center p-4 md:p-6 font-sans overflow-hidden">
      
      <!-- Background Image & Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="assets/hotel-bg.png" alt="Hotel Lobby" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
      </div>

      <!-- Main Landing Content -->
      <div class="relative z-10 w-full max-w-lg text-center">
        
        <!-- Brand Header -->
        <div class="mb-12 animation-fade-in-up">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-2xl shadow-black/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">VILLORA</h1>
          <p class="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-[0.4em] mt-2 drop-shadow-md">Luxury Hotels & Resorts</p>
        </div>

        <!-- Portals Grid -->
        <div class="grid gap-6 animation-fade-in-up animation-delay-100">
          
          <!-- Guest Portal Button -->
          <button (click)="navigateToGuest()" 
                  class="group relative w-full overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 hover:border-teal-400/50 rounded-[32px] p-6 md:p-8 text-left transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:-translate-y-1 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div class="relative flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">Guest Portal</h2>
                <p class="text-slate-300 text-sm md:text-base leading-relaxed">Check-in, access room controls, and request premium services.</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 ml-4 group-hover:bg-teal-500 group-hover:text-slate-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-400 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <!-- Staff Portal Button -->
          <button (click)="navigateToStaff()" 
                  class="group relative w-full overflow-hidden bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 hover:border-indigo-500/50 rounded-[32px] p-6 md:p-8 text-left transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-1 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div class="relative flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Staff Portal</h2>
                <p class="text-indigo-200/70 text-sm md:text-base leading-relaxed">Access internal dashboard, manage requests, and track tasks.</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 ml-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animation-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    .animation-delay-100 { animation-delay: 100ms; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToGuest() {
    this.router.navigate(['/login', '402-A9F8']); // Using the default mock room token
  }

  navigateToStaff() {
    this.router.navigate(['/staff/login']);
  }
}
