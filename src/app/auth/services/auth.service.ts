import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from 'src/environment/environments';
import { LoginResponse, User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(({ error }) => {
        return throwError(() => error);
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    console.log(this.authStatus());
    localStorage.setItem('token', token);

    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }
}
