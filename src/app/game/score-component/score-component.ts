import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Combo } from '../interfaces/combo.interface';

@Component({
  selector: 'score-component',
  imports: [RouterLink],
  templateUrl: './score-component.html',
  styleUrl: './score-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  time = input<number>(0);
  combos = input<Combo[]>([]);
  totalScore = signal<number>(0);
  displayedTime = signal<number>(0);
  gameOver = input<boolean>(false);
  playAgain = output<void>();
  #destroyRef = inject(DestroyRef);
  #scoreInterval: ReturnType<typeof setInterval> | null = null;
  #scoreTimeout: ReturnType<typeof setTimeout> | null = null;
  #scoreCalculated = false;

  activeComboIndex = signal<number>(-1);

  constructor() {
    this.#destroyRef.onDestroy(() => this.clearScoreTimers());

    effect(() => {
      const currentTime = this.time();

      if (this.gameOver() && !this.#scoreCalculated) {
        this.#scoreCalculated = true;
        this.displayedTime.set(currentTime);
        this.makeScoreCalculations();
      }
    });
  }

  calculateBaseScore(): number {
    return this.time() * 1000;
  }

  calculateComboScore(): number {
    return this.combos().reduce((acc, combo) => acc + combo.score, 0);
  }

  calculateTotalScore(): number {
    return this.calculateBaseScore() + this.calculateComboScore();
  }

  makeScoreCalculations() {
    const scoreStep = 100;
    const baseScore = this.calculateBaseScore();

    this.totalScore.set(0);
    this.displayedTime.set(this.time());

    this.animateScoreTo(
      baseScore,
      scoreStep,
      () => {
        this.displayedTime.set(0);
        this.#scoreTimeout = setTimeout(() => {
          this.animateComboScores(scoreStep);
        }, 250);
      },
      (nextScore) => {
        this.displayedTime.set(Math.max(0, Math.ceil((baseScore - nextScore) / 1000)));
      },
    );
  }

  animateComboScores(scoreStep: number) {
    const comboScores = this.combos().map((combo) => combo.score);

    const animateNextCombo = (index: number) => {
      if (index >= comboScores.length) {
        return;
      }
      this.activeComboIndex.set(index);
      this.animateScoreTo(this.totalScore() + comboScores[index], scoreStep, () => {
        this.#scoreTimeout = setTimeout(() => {
          animateNextCombo(index + 1);
        }, 250);
      });
    };

    animateNextCombo(0);
  }

  animateScoreTo(
    targetScore: number,
    scoreStep: number,
    onComplete?: () => void,
    onProgress?: (nextScore: number) => void,
  ) {
    this.clearScoreInterval();

    this.#scoreInterval = setInterval(() => {
      const nextScore = Math.min(this.totalScore() + scoreStep, targetScore);
      this.totalScore.set(nextScore);
      onProgress?.(nextScore);
      if (nextScore >= targetScore) {
        this.clearScoreInterval();
        onComplete?.();
      }
    }, 1);
  }

  clearScoreInterval() {
    if (this.#scoreInterval) {
      clearInterval(this.#scoreInterval);
      this.#scoreInterval = null;
    }
  }

  clearScoreTimeout() {
    if (this.#scoreTimeout) {
      clearTimeout(this.#scoreTimeout);
      this.#scoreTimeout = null;
    }
  }

  clearScoreTimers() {
    this.clearScoreInterval();
    this.clearScoreTimeout();
  }
}
