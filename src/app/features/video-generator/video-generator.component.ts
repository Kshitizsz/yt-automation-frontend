import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoJobService } from '../../core/services/services';
import { VideoJob, VideoJobStatus, VideoJobStatusLabel, CreateVideoJobDto } from '../../core/models/models';

@Component({
  selector: 'app-video-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Video Generator</h1>
          <p class="page-sub">AI-powered end-to-end video creation pipeline</p>
        </div>
      </div>

      <div class="gen-layout">
        <!-- Create Form -->
        <div class="card create-card">
          <h2 class="card-title">🎬 Create New Video</h2>

          <div class="pipeline-steps">
            <div class="step"><span class="step-num">1</span><span>ChatGPT Script</span></div>
            <div class="step-arrow">→</div>
            <div class="step"><span class="step-num">2</span><span>ElevenLabs Voice</span></div>
            <div class="step-arrow">→</div>
            <div class="step"><span class="step-num">3</span><span>D-ID Video</span></div>
            <div class="step-arrow">→</div>
            <div class="step"><span class="step-num">4</span><span>DALL-E Thumbnail</span></div>
            <div class="step-arrow">→</div>
            <div class="step"><span class="step-num">5</span><span>GPT-4o SEO</span></div>
          </div>

          <form (ngSubmit)="createJob()">
            <div class="form-group">
              <label>Video Topic *</label>
              <input [(ngModel)]="form.topic" name="topic" required
                     placeholder="e.g. 10 Ways AI is Changing Education in 2025" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Niche Category *</label>
                <select [(ngModel)]="form.nicheCategory" name="niche" required>
                  <option value="">Select niche...</option>
                  <option *ngFor="let n of niches" [value]="n">{{ n }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>AI Model</label>
                <select [(ngModel)]="form.aiModel" name="aiModel">
                  <option value="gpt-4o">GPT-4o (Best)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Schedule (optional)</label>
              <input type="datetime-local" [(ngModel)]="scheduleAt" name="scheduleAt" />
            </div>
            <div class="toggle-row">
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="form.autoPublish" name="autoPublish" />
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                Auto-publish to YouTube
              </label>
            </div>

            <div class="error-msg" *ngIf="error()">{{ error() }}</div>
            <button type="submit" class="btn-primary" [disabled]="creating()">
              {{ creating() ? 'Queuing...' : '🚀 Generate Video' }}
            </button>
          </form>
        </div>

        <!-- Jobs List -->
        <div class="card jobs-card">
          <div class="card-header">
            <h2 class="card-title">📋 Video Jobs</h2>
            <button class="btn-outline" (click)="loadJobs()">↻ Refresh</button>
          </div>

          <div *ngIf="loading()" class="loading-state">Loading jobs...</div>

          <div class="jobs-list" *ngIf="!loading()">
            <div *ngFor="let job of jobs()" class="job-card">
              <div class="job-header">
                <div class="job-left">
                  <div class="job-thumb" [style.background-image]="job.thumbnailUrl ? 'url('+job.thumbnailUrl+')' : ''">
                    <span *ngIf="!job.thumbnailUrl">🎥</span>
                  </div>
                  <div class="job-meta">
                    <span class="job-title">{{ job.title || job.topic }}</span>
                    <span class="job-niche">{{ job.nicheCategory }}</span>
                    <span class="job-date">{{ job.createdAt | date:'MMM d, h:mm a' }}</span>
                  </div>
                </div>
                <div class="job-right">
                  <span class="status-badge" [ngClass]="statusClass(job.status)">{{ statusLabel(job.status) }}</span>
                </div>
              </div>

              <!-- Progress bar for active jobs -->
              <div class="progress-bar" *ngIf="isActive(job.status)">
                <div class="progress-fill" [style.width.%]="getProgress(job.status)">
                  <span class="progress-label">{{ getProgress(job.status) }}%</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="job-actions" *ngIf="job.status === 6 || job.status === 8">
                <a *ngIf="job.youtubeVideoId" [href]="'https://youtube.com/watch?v='+job.youtubeVideoId" target="_blank" class="btn-yt">▶ View on YouTube</a>
                <button *ngIf="job.status === 6" class="btn-publish" (click)="markForPublish(job)">📤 Publish Now</button>
              </div>

              <div class="job-error" *ngIf="job.errorMessage">{{ job.errorMessage }}</div>
            </div>

            <div *ngIf="!jobs().length" class="empty-state">
              No video jobs yet. Create one on the left!
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:32px; max-width:1400px; font-family:'DM Sans',sans-serif; }
    .page-header { margin-bottom:32px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }

    .gen-layout { display:grid;grid-template-columns:420px 1fr;gap:24px; }
    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px; }
    .card-title { font-size:16px;font-weight:700;color:#fff;margin:0 0 20px; }
    .card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }

    .pipeline-steps { display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:24px;padding:12px;background:#1a1a2e;border-radius:10px; }
    .step { display:flex;align-items:center;gap:6px;font-size:11px;color:#888; }
    .step-num { width:20px;height:20px;background:linear-gradient(135deg,#ff0050,#ff4d00);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0; }
    .step-arrow { color:#444;font-size:12px; }

    .form-group { margin-bottom:16px; }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
    label { display:block;font-size:13px;font-weight:500;color:#aaa;margin-bottom:6px; }
    input,select { width:100%;padding:10px 14px;background:#1a1a2e;border:1px solid #2a2a3e;border-radius:8px;color:#fff;font-size:13px;outline:none;transition:border 0.2s;box-sizing:border-box; }
    input:focus,select:focus { border-color:#ff0050; }
    select option { background:#1a1a2e; }

    .toggle-row { margin-bottom:20px; }
    .toggle-label { display:flex;align-items:center;gap:10px;font-size:13px;color:#aaa;cursor:pointer; }
    .toggle-label input[type=checkbox] { display:none; }

    .error-msg { color:#ff4444;font-size:12px;margin-bottom:12px; }
    .btn-primary { width:100%;padding:13px;background:linear-gradient(135deg,#ff0050,#ff4d00);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:600;cursor:pointer; }
    .btn-primary:disabled { opacity:0.5;cursor:not-allowed; }
    .btn-outline { padding:8px 14px;background:transparent;border:1px solid #2a2a3e;border-radius:8px;color:#888;font-size:13px;cursor:pointer; }
    .btn-outline:hover { border-color:#ff0050;color:#ff0050; }

    .loading-state { color:#666;text-align:center;padding:40px; }
    .jobs-list { display:flex;flex-direction:column;gap:12px;max-height:600px;overflow-y:auto; }

    .job-card { background:#1a1a2e;border-radius:12px;padding:16px;border:1px solid #2a2a3e; }
    .job-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; }
    .job-left { display:flex;align-items:center;gap:12px; }
    .job-thumb { width:56px;height:40px;border-radius:6px;background:#2a2a3e;display:flex;align-items:center;justify-content:center;font-size:18px;background-size:cover;background-position:center;flex-shrink:0; }
    .job-meta { display:flex;flex-direction:column; }
    .job-title { font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px; }
    .job-niche { font-size:11px;color:#666; }
    .job-date { font-size:11px;color:#555; }
    .job-right { flex-shrink:0; }

    .status-badge { padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600; }
    .status-active { background:rgba(120,80,255,0.2);color:#9b6bff; }
    .status-done { background:rgba(0,200,100,0.15);color:#00c864; }
    .status-failed { background:rgba(255,50,50,0.15);color:#ff3232; }
    .status-pending { background:rgba(255,170,0,0.15);color:#ffaa00; }

    .progress-bar { height:6px;background:#2a2a3e;border-radius:3px;margin:8px 0;overflow:hidden;position:relative; }
    .progress-fill { height:100%;background:linear-gradient(90deg,#ff0050,#ff4d00);border-radius:3px;transition:width 0.5s;position:relative;min-width:30px; }
    .progress-label { position:absolute;right:6px;top:-1px;font-size:9px;color:rgba(255,255,255,0.8); }

    .job-actions { display:flex;gap:8px;margin-top:8px; }
    .btn-yt { padding:6px 12px;background:#ff0000;border:none;border-radius:6px;color:#fff;font-size:12px;text-decoration:none;cursor:pointer; }
    .btn-publish { padding:6px 12px;background:rgba(0,200,100,0.2);border:1px solid #00c864;border-radius:6px;color:#00c864;font-size:12px;cursor:pointer; }
    .job-error { font-size:11px;color:#ff4444;margin-top:6px; }
    .empty-state { text-align:center;color:#555;padding:40px;font-size:14px; }

    @media (max-width:1100px) { .gen-layout { grid-template-columns:1fr; } }
  `]
})
export class VideoGeneratorComponent implements OnInit {
  private jobService = inject(VideoJobService);

  jobs = signal<VideoJob[]>([]);
  loading = signal(true);
  creating = signal(false);
  error = signal('');
  scheduleAt = '';

  form: CreateVideoJobDto = {
    topic: '', nicheCategory: '', aiModel: 'gpt-4o', autoPublish: false
  };

  niches = ['Technology', 'Finance & Investing', 'Health & Fitness', 'Education', 'Entertainment',
    'Gaming', 'Travel', 'Food & Cooking', 'Beauty & Fashion', 'Business & Marketing',
    'Science', 'Sports', 'News & Politics', 'Motivation', 'DIY & Crafts'];

  ngOnInit() { this.loadJobs(); }

  loadJobs() {
    this.loading.set(true);
    this.jobService.getAll().subscribe({
      next: jobs => { this.jobs.set(jobs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  createJob() {
    if (!this.form.topic || !this.form.nicheCategory) { this.error.set('Topic and niche are required.'); return; }
    this.creating.set(true); this.error.set('');
    const dto = { ...this.form, scheduleAt: this.scheduleAt || undefined };
    this.jobService.create(dto).subscribe({
      next: job => {
        this.jobs.update(jobs => [job, ...jobs]);
        this.form = { topic: '', nicheCategory: '', aiModel: 'gpt-4o', autoPublish: false };
        this.scheduleAt = '';
        this.creating.set(false);
        // Poll for updates
        this.pollJob(job.id);
      },
      error: err => { this.error.set(err.error?.message ?? 'Failed to create job'); this.creating.set(false); }
    });
  }

  pollJob(id: number) {
    const interval = setInterval(() => {
      this.jobService.get(id).subscribe(updated => {
        this.jobs.update(jobs => jobs.map(j => j.id === id ? updated : j));
        if ([6, 7, 8, 9, 10].includes(updated.status)) clearInterval(interval);
      });
    }, 5000);
  }

  markForPublish(job: VideoJob) { /* Implement publish API call */ }

  statusLabel(s: VideoJobStatus) { return VideoJobStatusLabel[s]; }
  statusClass(s: VideoJobStatus) {
    if ([0].includes(s)) return 'status-pending';
    if ([1, 2, 3, 4, 5, 7].includes(s)) return 'status-active';
    if ([6, 8].includes(s)) return 'status-done';
    return 'status-failed';
  }
  isActive(s: VideoJobStatus) { return [1, 2, 3, 4, 5].includes(s); }
  getProgress(s: VideoJobStatus) {
    const map: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 75, 5: 90 };
    return map[s] ?? 0;
  }
}
