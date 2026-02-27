import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/services';
import { AnalyticsSummary } from '../../core/models/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-sub">Track your YouTube performance</p>
        </div>
        <button class="btn-sync" (click)="sync()" [disabled]="syncing()">
          {{ syncing() ? 'Syncing...' : '🔄 Sync YouTube' }}
        </button>
      </div>

      <div *ngIf="loading()" class="loading-state">Loading analytics...</div>

      <ng-container *ngIf="!loading() && data()">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">👁</span>
            <span class="stat-val">{{ data()!.totalViews | number }}</span>
            <span class="stat-lbl">Total Views</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">👍</span>
            <span class="stat-val">{{ data()!.totalLikes | number }}</span>
            <span class="stat-lbl">Total Likes</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💬</span>
            <span class="stat-val">{{ data()!.totalComments | number }}</span>
            <span class="stat-lbl">Comments</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🎬</span>
            <span class="stat-val">{{ data()!.publishedVideos }}/{{ data()!.totalVideos }}</span>
            <span class="stat-lbl">Published</span>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Recent Video Performance</h2>
          <table class="perf-table" *ngIf="data()!.recentVideos.length; else noVideos">
            <thead>
              <tr><th>Title</th><th>Views</th><th>Likes</th><th>Comments</th><th>Watch Time</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of data()!.recentVideos">
                <td class="video-title">{{ v.title }}</td>
                <td>{{ v.views | number }}</td>
                <td>{{ v.likes | number }}</td>
                <td>{{ v.comments | number }}</td>
                <td>{{ v.watchTimeMinutes | number:'1.0-1' }}m</td>
              </tr>
            </tbody>
          </table>
          <ng-template #noVideos>
            <div class="empty-state">No published videos yet. Start creating!</div>
          </ng-template>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { padding:32px;max-width:1200px;font-family:'DM Sans',sans-serif; }
    .page-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }
    .btn-sync { padding:10px 20px;background:#1e1e2e;border:1px solid #2a2a3e;border-radius:8px;color:#aaa;font-size:13px;cursor:pointer; }
    .btn-sync:hover { border-color:#ff0050;color:#ff0050; }
    .loading-state { color:#666;text-align:center;padding:60px; }
    .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px; }
    .stat-card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:8px; }
    .stat-icon { font-size:24px; }
    .stat-val { font-size:28px;font-weight:800;color:#fff; }
    .stat-lbl { font-size:12px;color:#666; }
    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px; }
    .card-title { font-size:16px;font-weight:700;color:#fff;margin:0 0 20px; }
    .perf-table { width:100%;border-collapse:collapse; }
    .perf-table th { text-align:left;padding:10px;font-size:12px;color:#666;border-bottom:1px solid #1e1e2e;font-weight:500; }
    .perf-table td { padding:12px 10px;font-size:13px;color:#ddd;border-bottom:1px solid #111; }
    .video-title { max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .empty-state { text-align:center;color:#555;padding:40px;font-size:14px; }
    @media(max-width:768px) { .stats-grid { grid-template-columns:1fr 1fr; } }
  `]
})
export class AnalyticsComponent implements OnInit {
  private service = inject(AnalyticsService);
  data = signal<AnalyticsSummary | null>(null);
  loading = signal(true);
  syncing = signal(false);

  ngOnInit() {
    this.service.getSummary().subscribe({ next: d => { this.data.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  sync() {
    this.syncing.set(true);
    this.service.sync().subscribe({ next: () => { this.syncing.set(false); this.ngOnInit(); }, error: () => this.syncing.set(false) });
  }
}
