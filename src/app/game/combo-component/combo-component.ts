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
    { name: 'GREAT 2 COMBO', score: 2000, audio: 'great' },
    { name: 'COOL 3 COMBO', score: 3000, audio: 'cool' },
    { name: 'CRAZY 4 COMBO', score: 4500, audio: 'crazy' },
    { name: 'MANIAC 5 COMBO', score: 6750, audio: 'maniac' },
    { name: 'INSANE 6 COMBO', score: 8000, audio: 'insane' },
    { name: 'SEER 7 COMBO', score: 9500, audio: 'seer' },
    { name: 'GODLIKE 8 COMBO', score: 12000, audio: 'godlike' },
  ];

  gameOver = input<boolean>(false);
  currentCombo = input<number | undefined>();
  lastCombo = signal<number>(0);
  emitCombo = output<Combo>();
  currentComboObject = computed(() => this.comboScores[(this.currentCombo() ?? 0) - 2]);

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
