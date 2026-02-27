import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/services';

// ─── JWT Interceptor (functional) ─────────────────────────────────────────────
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const token = auth.token;
  if (token) {
    const cloned = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    return next(cloned);
  }
  return next(req);
};

// ─── Auth Guard (functional) ──────────────────────────────────────────────────
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated) return true;
  router.navigate(['/auth/login']);
  return false;
};
