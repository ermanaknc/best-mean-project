import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private token: string | null = null;
  private apiUrl = `${environment.apiUrl}/api/users`;
  private tokenTimer: ReturnType<typeof setTimeout> | null = null;

  private _isAuthenticated = signal<boolean>(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  private _userId = signal<string | null>(null);
  readonly userId = this._userId.asReadonly();

  signup(email: string, password: string) {
    this._isLoading.set(true);
    this.http
      .post<{ message: string; result: any }>(`${this.apiUrl}/signup`, { email, password })
      .subscribe({
        next: () => {
          this._isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this._isLoading.set(false);
        },
      });
  }

  login(email: string, password: string) {
    this._isLoading.set(true);
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .subscribe({
        next: (response) => {
          const token = response.token;
          if (token) {
            this.token = token;
            const expirationDate = new Date(Date.now() + response.expiresIn * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationDate.toISOString());
            localStorage.setItem('userId', response.userId);
            this._userId.set(response.userId);
            this._isAuthenticated.set(true);
            this.setAutoLogoutTimer(response.expiresIn);
          }
          this._isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this._isLoading.set(false);
        },
      });
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('tokenExpiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    const remainingMs = new Date(expirationDate).getTime() - Date.now();

    if (remainingMs <= 0) {
      this.logout();
      return;
    }

    this.token = token;
    this._userId.set(userId);
    this._isAuthenticated.set(true);
    this.setAutoLogoutTimer(remainingMs / 1000);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userId');
    this._userId.set(null);
    this._isAuthenticated.set(false);
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
    this.router.navigate(['/']);
  }

  private setAutoLogoutTimer(expiresInSeconds: number) {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInSeconds * 1000);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
}
