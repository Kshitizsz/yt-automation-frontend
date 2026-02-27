import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-circle c1"></div>
        <div class="bg-circle c2"></div>
      </div>
      <div class="auth-card">
        <div class="auth-logo">
          <span class="logo-icon">▶</span>
          <h1>YT<span class="accent">Auto</span></h1>
        </div>
        <p class="auth-subtitle">Create your account</p>

        <form (ngSubmit)="register()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="your_channel_name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Min 8 characters" />
          </div>

          <div class="error-msg" *ngIf="error()">{{ error() }}</div>

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-link">Already have an account? <a routerLink="/auth/login">Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0f; position:relative; overflow:hidden; font-family:'DM Sans',sans-serif; }
    .auth-bg { position:absolute; inset:0; pointer-events:none; }
    .bg-circle { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.15; }
    .c1 { width:400px;height:400px;background:#ff0050;top:-100px;right:-100px; }
    .c2 { width:300px;height:300px;background:#7c3aed;bottom:-50px;left:-50px; }
    .auth-card { background:#0f0f1a; border:1px solid #1e1e2e; border-radius:20px; padding:48px 40px; width:100%; max-width:420px; position:relative;z-index:1; }
    .auth-logo { display:flex;align-items:center;gap:12px;margin-bottom:8px; }
    .logo-icon { width:44px;height:44px;background:linear-gradient(135deg,#ff0050,#ff4d00);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px; }
    .auth-logo h1 { font-size:28px;font-weight:800;color:#fff;margin:0; }
    .accent { color:#ff0050; }
    .auth-subtitle { color:#666;font-size:14px;margin-bottom:32px; }
    .form-group { margin-bottom:20px; }
    label { display:block;font-size:13px;font-weight:500;color:#aaa;margin-bottom:8px; }
    input { width:100%;padding:12px 16px;background:#1a1a2e;border:1px solid #2a2a3e;border-radius:10px;color:#fff;font-size:14px;outline:none;transition:border 0.2s;box-sizing:border-box; }
    input:focus { border-color:#ff0050; }
    input::placeholder { color:#444; }
    .error-msg { color:#ff4444;font-size:13px;margin-bottom:16px; }
    .btn-primary { width:100%;padding:14px;background:linear-gradient(135deg,#ff0050,#ff4d00);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.2s; }
    .btn-primary:hover:not(:disabled) { opacity:0.9; }
    .btn-primary:disabled { opacity:0.5;cursor:not-allowed; }
    .auth-link { text-align:center;margin-top:24px;color:#666;font-size:14px; }
    .auth-link a { color:#ff0050;text-decoration:none;font-weight:600; }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = ''; email = ''; password = '';
  loading = signal(false);
  error = signal('');

  register() {
    this.loading.set(true); this.error.set('');
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => { this.error.set(err.error?.message ?? 'Registration failed'); this.loading.set(false); }
    });
  }
}
