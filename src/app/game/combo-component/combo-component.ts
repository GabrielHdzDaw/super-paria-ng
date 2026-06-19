import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Combo } from '../interfaces/combo.interface';
import { SoundService } from 'src/app/shared/sound-service';

@Component({
  selector: 'combo-component',
  imports: [],
  templateUrl: './combo-component.html',
  styleUrl: './combo-component.css',
})
export class ComboComponent {
  audioService = inject(SoundService);

  comboScores: Combo[] = [
    { name: 'GREAT', number: 2, score: 2000, audio: 'great' },
    { name: 'COOL', number: 3, score: 3000, audio: 'cool' },
    { name: 'CRAZY', number: 4, score: 4500, audio: 'crazy' },
    { name: 'MANIAC', number: 5, score: 6750, audio: 'maniac' },
    { name: 'INSANE', number: 6, score: 8000, audio: 'insane' },
    { name: 'SEER', number: 7, score: 9500, audio: 'seer' },
    { name: 'GODLIKE', number: 8, score: 12000, audio: 'godlike' },
  ];

  gameOver = input<boolean>(false);
  currentCombo = input<number | undefined>();
  lastCombo = signal<number>(0);
  emitCombo = output<Combo>();
  currentComboObject = computed(() => this.comboScores[(this.currentCombo() ?? 0) - 2]);

  animationDuration = computed(() => {
    const combo = this.currentCombo() ?? 0;
    const min = 0.05;
    const max = 0.3;
    if (combo < 2) return `${max}s`;
    const capped = Math.min(combo, 8);
    const duration = max - ((capped - 2) / 6) * (max - min);
    return `${duration.toFixed(2)}s`;
  });

  constructor() {
    effect(() => {
      const current = this.currentCombo() ?? 0;
      const last = this.lastCombo();

      if (current < last && last >= 2) {
        const combo = this.comboScores[last - 2];
        if (combo) this.emitCombo.emit(combo);
      }

      this.lastCombo.set(current);
    });

    effect(() => {
      if (this.gameOver()) {
        const current = this.currentCombo() ?? 0;
        if (current >= 2) {
          const combo = this.comboScores[current - 2];
          if (combo) this.emitCombo.emit(combo);
        }
      }
    });

    effect(() => {
      const current = this.currentCombo() ?? 0;
      if (current >= 2) {
        const combo = this.comboScores[current - 2];
        if (combo) {
          this.audioService.play(combo.audio, 0.2);
        }
      }
    });
  }
}
