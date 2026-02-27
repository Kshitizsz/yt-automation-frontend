import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">Configure your API keys and preferences</p>
      </div>

      <div class="settings-grid">
        <div class="card">
          <h2 class="section-title">🤖 AI API Keys</h2>
          <p class="section-note">Keys are stored securely in your backend appsettings.json or Azure Key Vault</p>
          <div class="key-list">
            <div class="key-item" *ngFor="let key of apiKeys">
              <div class="key-info">
                <span class="key-name">{{ key.name }}</span>
                <span class="key-desc">{{ key.desc }}</span>
              </div>
              <span class="key-status" [ngClass]="key.status">{{ key.status }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title">⚙ Preferences</h2>
          <div class="pref-item">
            <div><span class="pref-label">Default AI Model</span><span class="pref-desc">For script generation</span></div>
            <select [(ngModel)]="defaultModel">
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>
          <div class="pref-item">
            <div><span class="pref-label">Default Market AI</span><span class="pref-desc">For trend analysis</span></div>
            <select [(ngModel)]="defaultMarketAI">
              <option value="gemini">Gemini</option>
              <option value="grok">Grok</option>
            </select>
          </div>
          <div class="pref-item">
            <div><span class="pref-label">Auto-Poll Jobs</span><span class="pref-desc">Refresh job status every 5s</span></div>
            <label class="switch">
              <input type="checkbox" [(ngModel)]="autoPoll" />
              <span class="slider"></span>
            </label>
          </div>
          <button class="btn-save">💾 Save Preferences</button>
        </div>

        <div class="card danger-card">
          <h2 class="section-title" style="color:#ff4444">🔴 Azure Deployment</h2>
          <p class="section-note">Your app is configured for Azure App Service (Free F1 Tier)</p>
          <div class="deploy-info">
            <div class="deploy-row"><span>API Backend</span><span class="badge">Azure App Service F1</span></div>
            <div class="deploy-row"><span>Frontend</span><span class="badge">Azure Static Web Apps (Free)</span></div>
            <div class="deploy-row"><span>Database</span><span class="badge">Azure SQL Basic (~$5/mo)</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:32px;max-width:1100px;font-family:'DM Sans',sans-serif; }
    .page-header { margin-bottom:24px; }
    .page-title { font-size:28px;font-weight:800;color:#fff;margin:0 0 4px; }
    .page-sub { color:#666;font-size:14px;margin:0; }
    .settings-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
    .card { background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:24px; }
    .danger-card { grid-column:1/-1; }
    .section-title { font-size:15px;font-weight:700;color:#fff;margin:0 0 8px; }
    .section-note { font-size:12px;color:#555;margin-bottom:16px; }
    .key-list { display:flex;flex-direction:column;gap:10px; }
    .key-item { display:flex;align-items:center;justify-content:space-between;padding:12px;background:#1a1a2e;border-radius:8px; }
    .key-info { display:flex;flex-direction:column; }
    .key-name { font-size:13px;font-weight:600;color:#fff; }
    .key-desc { font-size:11px;color:#666; }
    .key-status { font-size:11px;padding:3px 10px;border-radius:10px;font-weight:600; }
    .configured { background:rgba(0,200,100,0.15);color:#00c864; }
    .required { background:rgba(255,170,0,0.15);color:#ffaa00; }
    .pref-item { display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #1e1e2e; }
    .pref-label { font-size:13px;font-weight:600;color:#fff;display:block; }
    .pref-desc { font-size:11px;color:#666; }
    select { background:#1a1a2e;border:1px solid #2a2a3e;border-radius:6px;color:#fff;padding:6px 10px;font-size:12px;outline:none; }
    .switch { position:relative;display:inline-block;width:44px;height:24px; }
    .switch input { opacity:0;width:0;height:0; }
    .slider { position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#2a2a3e;border-radius:12px;transition:.3s; }
    .slider:before { content:'';position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:#666;border-radius:50%;transition:.3s; }
    input:checked+.slider { background:rgba(255,0,80,0.3); }
    input:checked+.slider:before { transform:translateX(20px);background:#ff0050; }
    .btn-save { margin-top:16px;padding:10px 20px;background:linear-gradient(135deg,#ff0050,#ff4d00);border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:600;cursor:pointer; }
    .deploy-info { display:flex;flex-direction:column;gap:10px;margin-top:8px; }
    .deploy-row { display:flex;align-items:center;justify-content:space-between;padding:10px;background:#1a1a2e;border-radius:8px;font-size:13px;color:#aaa; }
    .badge { background:#2a2a3e;color:#888;padding:4px 10px;border-radius:6px;font-size:11px; }
    @media(max-width:768px) { .settings-grid { grid-template-columns:1fr; } }
  `]
})
export class SettingsComponent {
  defaultModel = 'gpt-4o';
  defaultMarketAI = 'gemini';
  autoPoll = true;

  apiKeys = [
    { name: 'OpenAI (GPT-4o)', desc: 'Script generation & SEO', status: 'required' },
    { name: 'ElevenLabs', desc: 'Voice over generation', status: 'required' },
    { name: 'D-ID', desc: 'AI avatar video creation', status: 'required' },
    { name: 'Google Gemini', desc: 'Market trend analysis', status: 'required' },
    { name: 'xAI Grok', desc: 'Real-time trend analysis', status: 'required' },
    { name: 'YouTube Data API', desc: 'Upload & analytics sync', status: 'required' }
  ];
}
