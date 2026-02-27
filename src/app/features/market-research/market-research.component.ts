import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketResearchService } from '../../core/services/services';
import { MarketInsight } from '../../core/models/models';

@Component({
  selector: 'app-market-research',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Market Research</h1>
          <p class="page-sub">AI-powered trend analysis using Grok & Gemini</p>
        </div>
      </div>

      <!-- Research Form -->
      <div class="card research-form">
        <div class="ai-badges">
          <span class="ai-badge grok" [class.selected]="aiSource==='grok'" (click)="aiSource='grok'">
            𝕏 Grok (Real-time web)
          </span>
          <span class="ai-badge gemini" [class.selected]="aiSource==='gemini'" (click)="aiSource='gemini'">
            ✦ Gemini (Deep analysis)
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Niche Category</label>
            <select [(ngModel)]="selectedNiche">
              <option value="">Select niche...</option>
              <option *ngFor="let n of niches" [value]="n">{{ n }}</option>
            </select>
          </div>
          <div class="form-group align-bottom">
            <button class="btn-primary" (click)="analyze()" [disabled]="loading() || !selectedNiche">
              {{ loading() ? 'Analyzing...' : '🔍 Analyze Trends' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Current Result -->
      <div class="card result-card" *ngIf="result()">
        <div class="result-header">
          <div>
            <h2>{{ result()!.nicheCategory }}</h2>
            <span class="ai-source-tag">via {{ result()!.aiSource | titlecase }}</span>
          </div>
          <div class="score-circle">
            <svg viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#2a2a3e" stroke-width="3"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#ff0050" stroke-width="3"
                [attr.stroke-dasharray]="result()!.trendScore + ', 100'"/>
            </svg>
            <span class="score-text">{{ result()!.trendScore | number:'1.0-0' }}</span>
          </div>
        </div>

        <p class="analysis-summary">{{ result()!.analysisSummary }}</p>

        <h3>🔥 Trending Topics (click to use as video idea)</h3>
        <div class="topics-grid">
          <div *ngFor="let topic of result()!.trendingTopics; let i=index"
               class="topic-card" (click)="selectTopic(topic)">
            <span class="topic-rank">#{{ i + 1 }}</span>
            <span class="topic-text">{{ topic }}</span>
            <span class="use-btn">→ Use</span>
          </div>
        </div>
      </div>

      <!-- Recent Trends -->
      <div class="card">
        <div class="card-header">
          <h2>Recent Insights</h2>
          <button class="btn-outline" (click)="loadTrends()">↻ Refresh</button>
        </div>
        <div class="trends-grid">
          <div *ngFor="let trend of trends()" class="trend-item">
            <div class="trend-top">
              <span class="trend-niche">{{ trend.nicheCategory }}</span>
              <span class="ai-pill" [ngClass]="trend.aiSource">{{ trend.aiSource }}</span>
            </div>
            <div class="trend-bar">
              <div class="trend-fill" [style.width.%]="trend.trendScore"></div>
              <span class="trend-score-num">{{ trend.trendScore | number:'1.0-0' }}%</span>
            </div>
            <div class="trend-topics-mini">
              <span *ngFor="let t of trend.trendingTopics.slice(0,2)" class="mini-tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:32px;max-width:1200px;font-family:'DM Sans',sans-serif; }
    .page-header { margin-bottom:24px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }

    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px;margin-bottom:20px; }
    .card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
    .card-header h2 { font-size:16px;font-weight:700;color:#fff;margin:0; }

    .ai-badges { display:flex;gap:12px;margin-bottom:20px; }
    .ai-badge { padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid #2a2a3e;color:#888;transition:all 0.2s; }
    .ai-badge.grok.selected { background:rgba(0,0,0,0.5);border-color:#fff;color:#fff; }
    .ai-badge.gemini.selected { background:rgba(66,133,244,0.2);border-color:#4285f4;color:#4285f4; }

    .form-row { display:grid;grid-template-columns:1fr auto;gap:16px;align-items:end; }
    .form-group { display:flex;flex-direction:column; }
    .align-bottom { justify-content:flex-end; }
    label { font-size:13px;font-weight:500;color:#aaa;margin-bottom:6px; }
    select { padding:10px 14px;background:#1a1a2e;border:1px solid #2a2a3e;border-radius:8px;color:#fff;font-size:13px;outline:none; }
    select option { background:#1a1a2e; }

    .btn-primary { padding:11px 28px;background:linear-gradient(135deg,#ff0050,#ff4d00);border:none;border-radius:8px;color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap; }
    .btn-primary:disabled { opacity:0.5;cursor:not-allowed; }
    .btn-outline { padding:8px 14px;background:transparent;border:1px solid #2a2a3e;border-radius:8px;color:#888;font-size:13px;cursor:pointer; }

    .result-card { border:1px solid rgba(255,0,80,0.3); }
    .result-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:16px; }
    .result-header h2 { font-size:20px;font-weight:800;color:#fff;margin:0 0 4px; }
    .ai-source-tag { font-size:12px;color:#666; }

    .score-circle { position:relative;width:60px;height:60px; }
    .score-circle svg { width:60px;height:60px;transform:rotate(-90deg); }
    .score-text { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:14px;font-weight:800;color:#ff0050; }

    .analysis-summary { color:#aaa;font-size:14px;line-height:1.6;margin-bottom:20px; }
    h3 { font-size:14px;font-weight:700;color:#888;margin-bottom:12px; }

    .topics-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:8px; }
    .topic-card { display:flex;align-items:center;gap:10px;padding:12px;background:#1a1a2e;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:all 0.2s; }
    .topic-card:hover { border-color:#ff0050;background:#2a0015; }
    .topic-rank { font-size:11px;font-weight:800;color:#ff0050;min-width:24px; }
    .topic-text { flex:1;font-size:13px;color:#ddd; }
    .use-btn { font-size:11px;color:#666;opacity:0; }
    .topic-card:hover .use-btn { opacity:1;color:#ff0050; }

    .trends-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
    .trend-item { background:#1a1a2e;border-radius:10px;padding:14px; }
    .trend-top { display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; }
    .trend-niche { font-size:13px;font-weight:700;color:#fff; }
    .ai-pill { padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600; }
    .ai-pill.grok { background:rgba(255,255,255,0.1);color:#fff; }
    .ai-pill.gemini { background:rgba(66,133,244,0.2);color:#4285f4; }
    .trend-bar { height:4px;background:#2a2a3e;border-radius:2px;margin-bottom:8px;position:relative; }
    .trend-fill { height:100%;background:linear-gradient(90deg,#ff0050,#ff4d00);border-radius:2px; }
    .trend-score-num { position:absolute;right:0;top:-14px;font-size:10px;color:#888; }
    .trend-topics-mini { display:flex;flex-wrap:wrap;gap:4px; }
    .mini-tag { padding:2px 7px;background:#2a2a3e;color:#888;border-radius:3px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px; }

    @media(max-width:768px) { .topics-grid,.trends-grid { grid-template-columns:1fr; } }
  `]
})
export class MarketResearchComponent implements OnInit {
  private service = inject(MarketResearchService);

  result = signal<MarketInsight | null>(null);
  trends = signal<MarketInsight[]>([]);
  loading = signal(false);
  selectedNiche = '';
  aiSource = 'gemini';

  niches = ['Technology', 'Finance & Investing', 'Health & Fitness', 'Education', 'Entertainment',
    'Gaming', 'Travel', 'Food & Cooking', 'Business & Marketing', 'Science'];

  ngOnInit() { this.loadTrends(); }

  analyze() {
    if (!this.selectedNiche) return;
    this.loading.set(true);
    this.service.analyze(this.selectedNiche, this.aiSource).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); this.loadTrends(); },
      error: () => this.loading.set(false)
    });
  }

  loadTrends() {
    this.service.getTrends().subscribe(t => this.trends.set(t));
  }

  selectTopic(topic: string) {
    // Could navigate to video generator with pre-filled topic
    alert(`Topic copied: ${topic}\n\nGo to Video Generator to use this!`);
  }
}
