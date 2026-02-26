import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Combo } from '../interfaces/combo.interface';

@Component({
  selector: 'combo-component',
  imports: [],
  templateUrl: './combo-component.html',
  styleUrl: './combo-component.css',
})
export class ComboComponent {
  greatComboAudio = new Audio('audio/great.wav');
  coolComboAudio = new Audio('audio/cool.wav');
  crazyComboAudio = new Audio('audio/crazy.wav');
  maniacComboAudio = new Audio('audio/maniac.wav');
  insaneComboAudio = new Audio('audio/insane.wav');
  seerComboAudio = new Audio('audio/seer.wav');
  godlikeComboAudio = new Audio('audio/godlike.wav');

  comboScores: Combo[] = [
    { name: 'GREAT 2 COMBO', score: 2000, audio: this.greatComboAudio },
    { name: 'COOL 3 COMBO', score: 3000, audio: this.coolComboAudio },
    { name: 'CRAZY 4 COMBO', score: 4500, audio: this.crazyComboAudio },
    { name: 'MANIAC 5 COMBO', score: 6750, audio: this.maniacComboAudio },
    { name: 'INSANE 6 COMBO', score: 8000, audio: this.insaneComboAudio },
    { name: 'SEER 7 COMBO', score: 9500, audio: this.seerComboAudio },
    { name: 'GODLIKE 8 COMBO', score: 12000, audio: this.godlikeComboAudio },
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
          const audioClone = combo.audio.cloneNode() as HTMLAudioElement;
          audioClone.volume = 0.3;
          audioClone.play();
        }
      }
    });
  }
}
