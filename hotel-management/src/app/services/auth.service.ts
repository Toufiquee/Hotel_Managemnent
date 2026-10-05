// login.model.ts

export interface LoginRequest {
  email: string;
  password: string;
}

// auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5038/api'; // Change to your API URL

  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  setAuthState(token: string, user: any): void {
    const storage = this.getStorage();

    if (token) {
      storage?.setItem('token', token);
    } else {
      storage?.removeItem('token');
    }

    if (user) {
      storage?.setItem('user', JSON.stringify(user));
    } else {
      storage?.removeItem('user');
    }

    this.currentUserSubject.next(user ?? null);
  }

  clearAuthState(): void {
    const storage = this.getStorage();
    storage?.removeItem('token');
    storage?.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getStorage()?.getItem('token');
  }

  private getStoredUser(): any {
    const storage = this.getStorage();
    const storedUser = storage?.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  private getStorage(): Storage | null {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage
      : null;
  }
}