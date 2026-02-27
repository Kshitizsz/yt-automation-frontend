import { Routes } from '@angular/router';
import { authGuard } from './core/interceptors/auth.interceptor';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'video-generator',
        loadComponent: () => import('./features/video-generator/video-generator.component').then(m => m.VideoGeneratorComponent)
      },
      {
        path: 'market-research',
        loadComponent: () => import('./features/market-research/market-research.component').then(m => m.MarketResearchComponent)
      },
      {
        path: 'seo-optimizer',
        loadComponent: () => import('./features/seo-optimizer/seo-optimizer.component').then(m => m.SeoOptimizerComponent)
      },
      {
        path: 'scheduled-posts',
        loadComponent: () => import('./features/scheduled-posts/scheduled-posts.component').then(m => m.ScheduledPostsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
