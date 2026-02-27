import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  dashboard() {
    return this.http.get(`${this.baseUrl}/Dashboard`);
  }

  marketResearch(payload:any){
    return this.http.post(`${this.baseUrl}/MarketResearch/analyze`, payload);
  }

  seo(payload:any){
    return this.http.post(`${this.baseUrl}/SEO/optimize`, payload);
  }

}