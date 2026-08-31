import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);

  getUser(): Observable<User> {
    return this.#http.get<User>('users/me');
  }

  getUserById(id: number): Observable<User> {
    return this.#http.get<User>(`users/${id}`);
  }
}
