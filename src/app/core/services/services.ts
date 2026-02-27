import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  AuthResponse, LoginDto, RegisterDto, VideoJob, CreateVideoJobDto,
  MarketInsight, SEOResponse, AnalyticsSummary, DashboardSummary
} from '../models/models';

// ─── Base API Service ─────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}

// ─── Auth Service ─────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private _currentUser = new BehaviorSubject<AuthResponse | null>(this.loadFromStorage());
  currentUser$ = this._currentUser.asObservable();

  get isAuthenticated(): boolean { return !!this._currentUser.value; }
  get currentUser(): AuthResponse | null { return this._currentUser.value; }
  get token(): string | null { return this._currentUser.value?.token ?? null; }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', dto).pipe(
      tap(res => { localStorage.setItem('auth', JSON.stringify(res)); this._currentUser.next(res); })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', dto).pipe(
      tap(res => { localStorage.setItem('auth', JSON.stringify(res)); this._currentUser.next(res); })
    );
  }

  logout(): void {
    localStorage.removeItem('auth');
    this._currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  private loadFromStorage(): AuthResponse | null {
    try { return JSON.parse(localStorage.getItem('auth') ?? 'null'); }
    catch { return null; }
  }
}

// ─── Video Job Service ─────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class VideoJobService {
  private api = inject(ApiService);

  getAll(): Observable<VideoJob[]> { return this.api.get<VideoJob[]>('/videojobs'); }
  get(id: number): Observable<VideoJob> { return this.api.get<VideoJob>(`/videojobs/${id}`); }
  create(dto: CreateVideoJobDto): Observable<VideoJob> { return this.api.post<VideoJob>('/videojobs', dto); }
  cancel(id: number): Observable<void> { return this.api.delete(`/videojobs/${id}`); }
}

// ─── Market Research Service ──────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class MarketResearchService {
  private api = inject(ApiService);

  analyze(niche: string, aiSource: string = 'gemini'): Observable<MarketInsight> {
    return this.api.post<MarketInsight>('/marketresearch/analyze', { nicheCategory: niche, aiSource });
  }

  getTrends(count: number = 10): Observable<MarketInsight[]> {
    return this.api.get<MarketInsight[]>(`/marketresearch/trends?count=${count}`);
  }
}

// ─── SEO Service ─────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class SEOService {
  private api = inject(ApiService);

  optimize(title: string, description: string, keywords?: string): Observable<SEOResponse> {
    return this.api.post<SEOResponse>('/seo/optimize', { title, description, keywords });
  }
}

// ─── Analytics Service ────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = inject(ApiService);

  getSummary(): Observable<AnalyticsSummary> { return this.api.get<AnalyticsSummary>('/analytics'); }
  sync(): Observable<any> { return this.api.post('/analytics/sync', {}); }
}

// ─── Dashboard Service ─────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);
  get(): Observable<DashboardSummary> { return this.api.get<DashboardSummary>('/dashboard'); }
}
