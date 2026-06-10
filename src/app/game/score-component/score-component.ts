import { Component, input, signal } from '@angular/core';
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

  calculateBaseScore(): number {
    return this.time() * 1000;
  }

  calculateComboScore(): number {
    return this.combos().reduce((acc, combo) => acc + combo.score, 0);
  }

  calculateTotalScore(): number {
    return this.calculateBaseScore() + this.calculateComboScore();
  }

  makeCalculations() {
    const baseScore = this.calculateBaseScore();
    const baseScoreDividedBy100 = baseScore / 100;
    for (let i = 0; i <= baseScore; i + baseScoreDividedBy100) {
      setTimeout(() => {
        this.totalScore.set(this.totalScore() + baseScoreDividedBy100);
      }, 100);
    }
  }
}
