import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private token: string | null = null;
  private tokenTimer: ReturnType<typeof setTimeout> | null = null;

  readonly isAuthenticated = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  signup(email: string, password: string) {
    this.isLoading.set(true);
    this.http
      .post<{ message: string; result: any }>('http://localhost:3000/api/users/signup', {
        email,
        password,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  login(email: string, password: string) {
    this.isLoading.set(true);
    this.http
      .post<{ token: string; expiresIn: number }>('http://localhost:3000/api/users/login', {
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
            this.isAuthenticated.set(true);
            this.setAutoLogoutTimer(response.expiresIn);
          }
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('tokenExpiration');

    if (!token || !expirationDate) {
      return;
    }

    const remainingMs = new Date(expirationDate).getTime() - Date.now();

    if (remainingMs <= 0) {
      this.logout();
      return;
    }

    this.token = token;
    this.isAuthenticated.set(true);
    this.setAutoLogoutTimer(remainingMs / 1000);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.isAuthenticated.set(false);
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
