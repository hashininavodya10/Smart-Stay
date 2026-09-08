import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="min-h-[100dvh] relative flex flex-col justify-center items-center p-4 md:p-6 font-sans overflow-hidden">
      
      <!-- Background Image & Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="assets/hotel-bg.png" alt="Hotel Lobby" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-indigo-950 via-slate-900/60 to-transparent"></div>
      </div>

      <!-- Main Login Card -->
      <div class="relative z-10 w-full max-w-md">
        
        <!-- Brand Header -->
        <div class="text-center mb-8 animation-fade-in-up">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 backdrop-blur-xl border border-indigo-400/30 mb-4 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">VILLORA STAFF</h1>
          <p class="text-[10px] md:text-sm font-medium text-indigo-300 uppercase tracking-[0.3em] mt-1 drop-shadow-md">Internal Portal</p>
        </div>

        <!-- Glassmorphism Form Container -->
        <div class="bg-slate-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl animation-fade-in-up animation-delay-100">
          
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">Staff Login</h2>
            <p class="text-indigo-200/70 text-sm">Enter your credentials to access the staff dashboard and manage tasks.</p>
          </div>

          <form class="space-y-5" (submit)="login($event)">
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Username Input -->
            <div class="space-y-1.5 group">
              <label class="text-xs font-bold text-indigo-300 uppercase tracking-wider pl-1">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" [(ngModel)]="username" name="username" placeholder="Enter your username" required
                  class="w-full bg-slate-900/60 border border-indigo-500/20 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-400 focus:bg-slate-900 transition-all shadow-inner">
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5 group">
              <label class="text-xs font-bold text-indigo-300 uppercase tracking-wider pl-1">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required
                  class="w-full bg-slate-900/60 border border-indigo-500/20 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-400 focus:bg-slate-900 transition-all shadow-inner">
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" [disabled]="loading"
                    class="w-full relative group overflow-hidden bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest rounded-xl px-4 py-4 mt-8 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span class="relative flex items-center justify-center gap-2">
                {{ loading ? 'Authenticating...' : 'Secure Login' }}
                <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 animation-fade-in-up animation-delay-200">
          <a routerLink="/" class="inline-flex items-center gap-2 text-indigo-400 hover:text-white font-medium transition-colors text-xs uppercase tracking-wider">
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
export class StaffAuthComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private router: Router, private http: HttpClient) {}

  async login(event: Event) {
    event.preventDefault();
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Attempt to login with backend
      const response = await firstValueFrom(
        this.http.post<any>('http://localhost:8080/api/auth/login', {
          username: this.username,
          password: this.password
        })
      );
      
      // Store staff details
      localStorage.setItem('staffId', response.id);
      localStorage.setItem('staffName', response.username);
      
      // Redirect
      this.router.navigate(['/staff/dashboard']);
    } catch (err: any) {
      // If backend is not available or credentials wrong, allow fallback for UI prototype purposes
      console.error('Login error:', err);
      if (err.status === 401) {
        this.errorMessage = 'Invalid username or password.';
      } else {
        // Fallback for prototype without backend
        console.warn('Backend unavailable, proceeding with mock staff login...');
        localStorage.setItem('staffName', this.username);
        this.router.navigate(['/staff/dashboard']);
      }
    } finally {
      this.loading = false;
    }
  }
}
