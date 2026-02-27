import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/services';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">▶</span>
            <span class="logo-text" *ngIf="!sidebarCollapsed()">YT<span class="accent">Auto</span></span>
          </div>
          <button class="collapse-btn" (click)="toggleSidebar()">
            {{ sidebarCollapsed() ? '→' : '←' }}
          </button>
        </div>

        <nav class="sidebar-nav">
          <a *ngFor="let item of navItems" class="nav-item"
             [routerLink]="item.route" routerLinkActive="active"
             [title]="sidebarCollapsed() ? item.label : ''">
            <span class="nav-icon">{{item.icon}}</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed()">{{item.label}}</span>
          </a>
        </nav>

        <div class="sidebar-footer" *ngIf="!sidebarCollapsed()">
          <div class="user-info">
            <div class="avatar">{{ (auth.currentUser?.username || 'U')[0].toUpperCase() }}</div>
            <div class="user-details">
              <span class="user-name">{{ auth.currentUser?.username }}</span>
              <span class="user-role">{{ auth.currentUser?.role }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.logout()">⏻ Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      background: #0a0a0f;
      font-family: 'DM Sans', sans-serif;
    }

    .sidebar {
      width: 260px;
      background: #0f0f1a;
      border-right: 1px solid #1e1e2e;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      flex-shrink: 0;
    }

    .sidebar.collapsed { width: 72px; }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px;
      border-bottom: 1px solid #1e1e2e;
    }

    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #ff0050, #ff4d00);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    .logo-text { font-size: 20px; font-weight: 700; color: #fff; white-space: nowrap; }
    .accent { color: #ff0050; }

    .collapse-btn {
      background: #1e1e2e; border: none; color: #888;
      width: 28px; height: 28px; border-radius: 6px;
      cursor: pointer; font-size: 12px; flex-shrink: 0;
    }
    .collapse-btn:hover { background: #2a2a3e; color: #fff; }

    .sidebar-nav { flex: 1; padding: 16px 8px; display: flex; flex-direction: column; gap: 4px; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 12px; border-radius: 10px;
      color: #888; text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap; overflow: hidden;
    }
    .nav-item:hover { background: #1e1e2e; color: #fff; }
    .nav-item.active { background: linear-gradient(135deg, rgba(255,0,80,0.2), rgba(255,77,0,0.1)); color: #ff0050; }

    .nav-icon { font-size: 18px; flex-shrink: 0; width: 20px; text-align: center; }
    .nav-label { font-size: 14px; font-weight: 500; }

    .sidebar-footer {
      padding: 16px; border-top: 1px solid #1e1e2e;
      display: flex; flex-direction: column; gap: 12px;
    }

    .user-info { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #ff0050, #ff4d00);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-size: 13px; font-weight: 600; color: #fff; }
    .user-role { font-size: 11px; color: #666; }

    .logout-btn {
      width: 100%; padding: 8px; background: #1e1e2e;
      border: 1px solid #2a2a3e; color: #888; border-radius: 8px;
      cursor: pointer; font-size: 13px; transition: all 0.2s;
    }
    .logout-btn:hover { background: #2a0015; border-color: #ff0050; color: #ff0050; }

    .main-content { flex: 1; overflow-y: auto; background: #0a0a0f; }
  `]
})
export class ShellComponent {
  auth = inject(AuthService);
  sidebarCollapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '⬡' },
    { label: 'Video Generator', route: '/video-generator', icon: '🎬' },
    { label: 'Market Research', route: '/market-research', icon: '📊' },
    { label: 'SEO Optimizer', route: '/seo-optimizer', icon: '🔍' },
    { label: 'Scheduled Posts', route: '/scheduled-posts', icon: '🗓' },
    { label: 'Analytics', route: '/analytics', icon: '📈' },
    { label: 'Settings', route: '/settings', icon: '⚙' }
  ];

  toggleSidebar() { this.sidebarCollapsed.update(v => !v); }
}
