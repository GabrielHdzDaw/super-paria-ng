import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { Combo } from '../interfaces/combo.interface';

@Component({
  selector: 'score-component',
  imports: [],
  templateUrl: './score-component.html',
  styleUrl: './score-component.css',
})
export class ScoreComponent {
  time = input<number>(0);
  combos = input<Combo[]>([]);
  totalScore = signal<number>(0);
  gameOver = input<boolean>(false);
  #destroyRef = inject(DestroyRef);
  #scoreInterval: ReturnType<typeof setInterval> | null = null;
  #scoreTimeout: ReturnType<typeof setTimeout> | null = null;
  #scoreCalculated = false;

  constructor() {
    this.#destroyRef.onDestroy(() => this.clearScoreTimers());

    effect(() => {
      if (this.gameOver() && !this.#scoreCalculated) {
        this.#scoreCalculated = true;
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

    this.totalScore.set(0);

    this.animateScoreTo(this.calculateBaseScore(), scoreStep, () => {
      this.#scoreTimeout = setTimeout(() => {
        this.animateComboScores(scoreStep);
      }, 250);
    });
  }

  animateComboScores(scoreStep: number) {
    const comboScores = this.combos().map((combo) => combo.score);

    const animateNextCombo = (index: number) => {
      if (index >= comboScores.length) {
        return;
      }

      this.animateScoreTo(this.totalScore() + comboScores[index], scoreStep, () => {
        this.#scoreTimeout = setTimeout(() => {
          animateNextCombo(index + 1);
        }, 250);
      });
    };

    animateNextCombo(0);
  }

  animateScoreTo(targetScore: number, scoreStep: number, onComplete?: () => void) {
    this.clearScoreInterval();

    this.#scoreInterval = setInterval(() => {
      const nextScore = Math.min(this.totalScore() + scoreStep, targetScore);
      this.totalScore.set(nextScore);

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
