import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Score } from '../interfaces/score.interface';

interface RankingPage {
  scores: Score[];
  hasNextPage: boolean;
}

@Component({
  selector: 'ranking-component',
  imports: [RouterLink],
  templateUrl: './ranking-component.html',
  styleUrl: './ranking-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  readonly pageSize = 4;
  page = signal(1);

  scoresResource = httpResource<RankingPage | Score[]>(
    () => `ranking?page=${this.page()}&limit=${this.pageSize}`,
  );
  ranking = linkedSignal<RankingPage | Score[] | undefined, Score[]>({
    source: () => this.scoresResource.value(),
    computation: (response, previous) =>
      (Array.isArray(response) ? response : response?.scores) ?? previous?.value ?? [],
  });

  loadPreviousPage() {
    if (this.scoresResource.isLoading() || !this.hasPreviousPage()) return;
    this.page.update((page) => page - 1);
  }

  loadNextPage() {
    if (this.scoresResource.isLoading() || !this.hasNextPage()) return;
    this.page.update((page) => page + 1);
  }

  hasPreviousPage() {
    return this.page() > 1;
  }

  hasNextPage() {
    const response = this.scoresResource.value();
    return Array.isArray(response)
      ? response.length === this.pageSize
      : (response?.hasNextPage ?? false);
  }
}
