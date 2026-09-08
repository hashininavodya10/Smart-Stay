import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-guest-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[100dvh] relative flex flex-col justify-center items-center p-4 md:p-6 font-sans overflow-hidden">
      
      <!-- Background Image & Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="assets/hotel-bg.png" alt="Hotel Lobby" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
      </div>

      <!-- Main Login Card -->
      <div class="relative z-10 w-full max-w-md">
        
        <!-- Brand Header -->
        <div class="text-center mb-8 animation-fade-in-up">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">VILLORA</h1>
          <p class="text-[10px] md:text-sm font-medium text-slate-300 uppercase tracking-[0.3em] mt-1 drop-shadow-md">Luxury Hotels & Resorts</p>
        </div>

        <!-- Glassmorphism Form Container -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl animation-fade-in-up animation-delay-100">
          
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">Welcome Guest</h2>
            <p class="text-slate-300 text-sm">Please verify your details to access personalized room services and controls.</p>
          </div>

          <form class="space-y-5" (submit)="login($event)">
            <!-- Room Token (Auto-filled) -->
            <div class="space-y-1.5 group">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Room Reference</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input type="text" [value]="roomToken" disabled 
                  class="w-full bg-slate-900/50 border border-slate-700 text-slate-300 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none cursor-not-allowed font-mono text-sm tracking-widest shadow-inner">
              </div>
            </div>

            <!-- Name Input -->
            <div class="space-y-1.5 group">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Primary Guest Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" placeholder="e.g. John Doe" 
                  class="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-teal-400 focus:bg-slate-900/80 transition-all shadow-inner">
              </div>
            </div>

            <!-- Email Input -->
            <div class="space-y-1.5 group">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input type="email" placeholder="john@example.com" 
                  class="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-teal-400 focus:bg-slate-900/80 transition-all shadow-inner">
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full relative group overflow-hidden bg-teal-500 text-slate-900 font-bold text-sm uppercase tracking-widest rounded-xl px-4 py-4 mt-8 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:-translate-y-0.5">
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span class="relative flex items-center justify-center gap-2">
                Access Room
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 animation-fade-in-up animation-delay-200">
          <a routerLink="/" class="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors text-xs uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
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
    .animation-delay-200 { animation-delay: 200ms; }

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
export class GuestAuthComponent implements OnInit {
  roomToken: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // In a real scenario, this gets pre-filled from the QR URL /login/:token
    this.roomToken = this.route.snapshot.paramMap.get('token') || '402-A9F8';
  }

  login(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/room', this.roomToken]);
  }
}
