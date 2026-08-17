import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { UserLogin, UserRegister, AccessToken } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #logged: WritableSignal<boolean> = signal<boolean>(!!localStorage.getItem('token'));

  getLogged(): Signal<boolean> {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<AccessToken>('auth/login', data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      }),
    );
  }

  loginGoogle(token: string): Observable<void> {
    return this.#http.post<AccessToken>('auth/google', { token }).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      }),
    );
  }

  loginFacebook(token: string): Observable<void> {
    return this.#http.post<AccessToken>('auth/facebook', { token }).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      }),
    );
  }

  register(data: UserRegister): Observable<void> {
    return this.#http.post('auth/register', data).pipe(
      map((res) => {
        console.log(res);
      }),
      catchError((err: Error) => {
        console.log(err.message);
        return of(void 0);
      }),
    );
  }

  isLogged(): Observable<boolean> {
    if (!localStorage.getItem('token') && !this.getLogged()()) {
      return of(false);
    }

    if (this.getLogged()()) return of(true);

    return this.#http.get('auth/validate').pipe(
      map(() => {
        this.#logged.set(true);
        return true;
      }),
      catchError(() => {
        localStorage.removeItem('token');
        return of(false);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#logged.set(false);
  }
}
