import { Component } from '@angular/core';

// Scheduled Posts Component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scheduled-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Scheduled Posts</h1>
        <p class="page-sub">Manage your YouTube publishing schedule</p>
      </div>
      <div class="card">
        <div class="empty-hero">
          <div class="empty-icon">🗓</div>
          <h2>Schedule videos via Video Generator</h2>
          <p>When creating a video job, set a schedule date to auto-publish to your YouTube channel.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:32px;font-family:'DM Sans',sans-serif; }
    .page-header { margin-bottom:24px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }
    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:48px;text-align:center; }
    .empty-hero { display:flex;flex-direction:column;align-items:center;gap:12px; }
    .empty-icon { font-size:48px; }
    h2 { color:#fff;font-size:18px;margin:0; }
    p { color:#666;font-size:14px;max-width:400px;margin:0;line-height:1.6; }
  `]
})
export class ScheduledPostsComponent {}
