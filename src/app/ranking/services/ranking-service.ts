import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../interfaces/score.interface';

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  #http = inject(HttpClient);

  getScores(): Observable<Score[]> {
    return this.#http.get<Score[]>('ranking');
  }

  sendScore(userId: number, score: number): Observable<void> {
    return this.#http.post<void>('ranking', { userId, score });
  }
}
