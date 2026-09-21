import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserLogin, UserRegister, AccessToken } from '../interfaces/auth.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #logged: WritableSignal<boolean> = signal<boolean>(!!localStorage.getItem('accessToken'));
  #user: WritableSignal<User | undefined> = signal<User | undefined>(undefined);

  getLogged(): Signal<boolean> {
    return this.#logged.asReadonly();
  }

  getUser(): Signal<User | undefined> {
    return this.#user.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<AccessToken>('auth/login', data).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
      }),
      switchMap(() => this.#http.get<User>('users/me')),
      tap((user) => {
        this.#user.set(user);
        this.#logged.set(true);
      }),
      map(() => void 0),
    );
  }

  // loginGoogle(token: string): Observable<void> {
  //   return this.#http.post<AccessToken>('auth/google', { token }).pipe(
  //     map((res) => {
  //       localStorage.setItem('token', res.accessToken);
  //       this.#logged.set(true);
  //     }),
  //   );
  // }

  // loginFacebook(token: string): Observable<void> {
  //   return this.#http.post<AccessToken>('auth/facebook', { token }).pipe(
  //     map((res) => {
  //       localStorage.setItem('token', res.accessToken);
  //       this.#logged.set(true);
  //     }),
  //   );
  // }

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
    if (!localStorage.getItem('accessToken')) {
      this.#logged.set(false);
      this.#user.set(undefined);
      return of(false);
    }

    if (this.#user()) return of(true);

    return this.#http.get<User>('users/me').pipe(
      tap((user) => {
        this.#user.set(user);
        this.#logged.set(true);
      }),
      catchError(() => {
        this.logout();
        return of(false);
      }),
      map(() => true),
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.#logged.set(false);
    this.#user.set(undefined);
  }
}
