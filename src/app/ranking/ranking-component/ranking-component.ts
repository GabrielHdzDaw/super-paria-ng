import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/shared/services/user-service';
import { Score } from '../interfaces/score.interface';

@Component({
  selector: 'ranking-component',
  imports: [RouterLink],
  templateUrl: './ranking-component.html',
  styleUrl: './ranking-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  #userService = inject(UserService);

  scoresResource = httpResource<Score[]>(() => 'ranking');
  ranking = signal<Score[]>([]);

  constructor() {
    effect((onCleanup) => {
      const scores = this.scoresResource.value();
      if (!scores?.length) {
        this.ranking.set([]);
        return;
      }

      const subscription = forkJoin(
        scores.map((score) => this.#userService.getUserById(score.user.id)),
      ).subscribe((users) => {
        this.ranking.set(scores.map((score, index) => ({ ...score, user: users[index] })));
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
