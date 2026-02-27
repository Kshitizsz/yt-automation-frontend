import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/services';
import { DashboardSummary, VideoJobStatus, VideoJobStatusLabel } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-sub">Your YouTube automation overview</p>
        </div>
        <a routerLink="/video-generator" class="btn-primary">+ New Video</a>
      </div>

      <div *ngIf="loading()" class="loading-state">Loading dashboard...</div>

      <ng-container *ngIf="!loading() && data()">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(255,0,80,0.15);color:#ff0050">🎬</div>
            <div class="stat-info">
              <span class="stat-value">{{ data()!.totalJobs }}</span>
              <span class="stat-label">Total Jobs</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(0,200,100,0.15);color:#00c864">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ data()!.completedJobs }}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(255,170,0,0.15);color:#ffaa00">🗓</div>
            <div class="stat-info">
              <span class="stat-value">{{ data()!.scheduledJobs }}</span>
              <span class="stat-label">Scheduled</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(120,80,255,0.15);color:#7850ff">👁</div>
            <div class="stat-info">
              <span class="stat-value">{{ data()!.totalViews | number }}</span>
              <span class="stat-label">Total Views</span>
            </div>
          </div>
        </div>

        <!-- Two columns -->
        <div class="grid-2col">
          <!-- Recent Jobs -->
          <div class="card">
            <div class="card-header">
              <h2>Recent Jobs</h2>
              <a routerLink="/video-generator" class="link-btn">View all →</a>
            </div>
            <div class="job-list">
              <div *ngFor="let job of data()!.recentJobs" class="job-item">
                <div class="job-thumbnail">🎥</div>
                <div class="job-info">
                  <span class="job-topic">{{ job.topic }}</span>
                  <span class="job-niche">{{ job.nicheCategory }}</span>
                </div>
                <span class="status-badge" [ngClass]="getStatusClass(job.status)">
                  {{ getStatusLabel(job.status) }}
                </span>
              </div>
              <div *ngIf="!data()!.recentJobs.length" class="empty-state">
                No jobs yet. <a routerLink="/video-generator">Create your first video!</a>
              </div>
            </div>
          </div>

          <!-- Top Trends -->
          <div class="card">
            <div class="card-header">
              <h2>Trending Topics</h2>
              <a routerLink="/market-research" class="link-btn">Explore →</a>
            </div>
            <div class="trend-list">
              <div *ngFor="let trend of data()!.topTrends" class="trend-item">
                <div class="trend-header">
                  <span class="trend-niche">{{ trend.nicheCategory }}</span>
                  <div class="trend-score">
                    <div class="score-bar">
                      <div class="score-fill" [style.width.%]="trend.trendScore"></div>
                    </div>
                    <span>{{ trend.trendScore | number:'1.0-0' }}%</span>
                  </div>
                </div>
                <div class="trend-topics">
                  <span *ngFor="let t of trend.trendingTopics.slice(0,3)" class="topic-tag">{{ t }}</span>
                </div>
              </div>
              <div *ngIf="!data()!.topTrends.length" class="empty-state">
                No trends yet. <a routerLink="/market-research">Run market research!</a>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1400px; font-family: 'DM Sans', sans-serif; }
    .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:32px; }
    .page-title { font-size:28px; font-weight:800; color:#fff; margin:0 0 4px; }
    .page-sub { color:#666; font-size:14px; margin:0; }
    .btn-primary { padding:12px 24px; background:linear-gradient(135deg,#ff0050,#ff4d00); border:none; border-radius:10px; color:#fff; font-size:14px; font-weight:600; cursor:pointer; text-decoration:none; display:inline-block; }

    .loading-state { color:#666; padding:40px; text-align:center; }

    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
    .stat-card { background:#0f0f1a; border:1px solid #1e1e2e; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; }
    .stat-icon { width:48px;height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
    .stat-info { display:flex; flex-direction:column; }
    .stat-value { font-size:24px; font-weight:800; color:#fff; }
    .stat-label { font-size:12px; color:#666; margin-top:2px; }

    .grid-2col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .card { background:#0f0f1a; border:1px solid #1e1e2e; border-radius:16px; padding:24px; }
    .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
    .card-header h2 { font-size:16px; font-weight:700; color:#fff; margin:0; }
    .link-btn { color:#ff0050; text-decoration:none; font-size:13px; }

    .job-list { display:flex; flex-direction:column; gap:12px; }
    .job-item { display:flex; align-items:center; gap:12px; padding:12px; background:#1a1a2e; border-radius:10px; }
    .job-thumbnail { font-size:20px; }
    .job-info { flex:1; display:flex; flex-direction:column; }
    .job-topic { font-size:13px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; }
    .job-niche { font-size:11px; color:#666; }

    .status-badge { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
    .status-pending { background:rgba(255,170,0,0.15); color:#ffaa00; }
    .status-active { background:rgba(120,80,255,0.15); color:#7850ff; }
    .status-done { background:rgba(0,200,100,0.15); color:#00c864; }
    .status-failed { background:rgba(255,50,50,0.15); color:#ff3232; }

    .trend-list { display:flex; flex-direction:column; gap:16px; }
    .trend-item { padding:12px; background:#1a1a2e; border-radius:10px; }
    .trend-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .trend-niche { font-size:13px; font-weight:700; color:#fff; }
    .trend-score { display:flex; align-items:center; gap:8px; font-size:12px; color:#888; }
    .score-bar { width:60px; height:4px; background:#2a2a3e; border-radius:2px; }
    .score-fill { height:100%; background:linear-gradient(90deg,#ff0050,#ff4d00); border-radius:2px; }
    .trend-topics { display:flex; flex-wrap:wrap; gap:6px; }
    .topic-tag { padding:3px 8px; background:#2a2a3e; color:#aaa; border-radius:4px; font-size:11px; }
    .empty-state { color:#555; font-size:13px; text-align:center; padding:16px; }
    .empty-state a { color:#ff0050; }

    @media (max-width:1100px) { .stats-grid { grid-template-columns:1fr 1fr; } }
    @media (max-width:768px) { .grid-2col { grid-template-columns:1fr; } .stats-grid { grid-template-columns:1fr 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  private dashService = inject(DashboardService);
  data = signal<DashboardSummary | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.dashService.get().subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getStatusLabel(status: VideoJobStatus): string { return VideoJobStatusLabel[status]; }

  getStatusClass(status: VideoJobStatus): string {
    if ([0, 1, 2, 3, 4, 5, 7].includes(status)) return 'status-active';
    if ([6, 8].includes(status)) return 'status-done';
    if ([9, 10].includes(status)) return 'status-failed';
    return 'status-pending';
  }
}
