import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SEOService } from '../../core/services/services';
import { SEOResponse } from '../../core/models/models';

@Component({
  selector: 'app-seo-optimizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">SEO Optimizer</h1>
        <p class="page-sub">Optimize your video titles, descriptions, and tags with GPT-4o</p>
      </div>

      <div class="seo-layout">
        <div class="card">
          <h2 class="card-title">🔍 Input</h2>
          <div class="form-group">
            <label>Video Title</label>
            <input [(ngModel)]="title" placeholder="Your current video title" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="description" rows="5" placeholder="Current description or topic overview..."></textarea>
          </div>
          <div class="form-group">
            <label>Keywords (optional)</label>
            <input [(ngModel)]="keywords" placeholder="AI, technology, 2025..." />
          </div>
          <button class="btn-primary" (click)="optimize()" [disabled]="loading() || !title">
            {{ loading() ? 'Optimizing...' : '✨ Optimize SEO' }}
          </button>
        </div>

        <div class="card result-card" *ngIf="result()">
          <div class="seo-score-header">
            <h2 class="card-title">✅ Optimized Results</h2>
            <div class="seo-score" [ngClass]="scoreClass()">
              {{ result()!.seoScore | number:'1.0-0' }}/100
            </div>
          </div>

          <div class="result-section">
            <label>Optimized Title</label>
            <div class="result-box copyable" (click)="copy(result()!.optimizedTitle)">
              {{ result()!.optimizedTitle }}
              <span class="copy-hint">📋</span>
            </div>
          </div>

          <div class="result-section">
            <label>Optimized Description</label>
            <div class="result-box desc-box copyable" (click)="copy(result()!.optimizedDescription)">
              {{ result()!.optimizedDescription }}
              <span class="copy-hint">📋</span>
            </div>
          </div>

          <div class="result-section">
            <label>Tags ({{ result()!.tags.length }})</label>
            <div class="tags-container">
              <span *ngFor="let tag of result()!.tags" class="tag">{{ tag }}</span>
            </div>
          </div>

          <div class="copy-success" *ngIf="copied()">✅ Copied to clipboard!</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:32px;max-width:1100px;font-family:'DM Sans',sans-serif; }
    .page-header { margin-bottom:24px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }
    .seo-layout { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px; }
    .card-title { font-size:16px;font-weight:700;color:#fff;margin:0 0 20px; }
    .form-group { margin-bottom:16px; }
    label { display:block;font-size:13px;font-weight:500;color:#aaa;margin-bottom:6px; }
    input,textarea { width:100%;padding:10px 14px;background:#1a1a2e;border:1px solid #2a2a3e;border-radius:8px;color:#fff;font-size:13px;outline:none;resize:vertical;box-sizing:border-box; }
    input:focus,textarea:focus { border-color:#ff0050; }
    .btn-primary { width:100%;padding:13px;background:linear-gradient(135deg,#ff0050,#ff4d00);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:600;cursor:pointer; }
    .btn-primary:disabled { opacity:0.5;cursor:not-allowed; }
    .seo-score-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
    .seo-score { font-size:20px;font-weight:800;padding:8px 16px;border-radius:10px; }
    .score-good { background:rgba(0,200,100,0.15);color:#00c864; }
    .score-avg { background:rgba(255,170,0,0.15);color:#ffaa00; }
    .score-low { background:rgba(255,50,50,0.15);color:#ff3232; }
    .result-section { margin-bottom:16px; }
    .result-box { background:#1a1a2e;border:1px solid #2a2a3e;border-radius:8px;padding:12px;color:#ddd;font-size:13px;line-height:1.5;cursor:pointer;position:relative;transition:border 0.2s; }
    .result-box:hover { border-color:#ff0050; }
    .desc-box { max-height:120px;overflow-y:auto; }
    .copy-hint { position:absolute;top:8px;right:8px;opacity:0.5;font-size:12px; }
    .tags-container { display:flex;flex-wrap:wrap;gap:6px; }
    .tag { padding:4px 10px;background:#2a2a3e;color:#aaa;border-radius:4px;font-size:12px; }
    .copy-success { color:#00c864;font-size:13px;margin-top:8px; }
    @media(max-width:768px) { .seo-layout { grid-template-columns:1fr; } }
  `]
})
export class SeoOptimizerComponent {
  private service = inject(SEOService);
  title = ''; description = ''; keywords = '';
  result = signal<SEOResponse | null>(null);
  loading = signal(false);
  copied = signal(false);

  optimize() {
    this.loading.set(true);
    this.service.optimize(this.title, this.description, this.keywords).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  scoreClass() {
    const s = this.result()!.seoScore;
    return s >= 75 ? 'score-good' : s >= 50 ? 'score-avg' : 'score-low';
  }

  copy(text: string) {
    navigator.clipboard.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
