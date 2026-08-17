import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private sounds: Record<string, HTMLAudioElement> = {
    great: new Audio('audio/great.wav'),
    cool: new Audio('audio/cool.wav'),
    crazy: new Audio('audio/crazy.wav'),
    maniac: new Audio('audio/maniac.wav'),
    insane: new Audio('audio/insane.wav'),
    seer: new Audio('audio/seer.wav'),
    godlike: new Audio('audio/godlike.wav'),
    click: new Audio('audio/click.mp3'),
    menu2: new Audio('audio/menu2.mp3'),
    menu3: new Audio('audio/menu2.mp3'),
    menu4: new Audio('audio/menu2.mp3'),
    menu5: new Audio('audio/menu2.mp3'),
    score: new Audio('audio/score.mp3'),
    scratch: new Audio('audio/scratch.mp3'),
    woosh: new Audio('audio/woosh.mp3'),
    match: new Audio('audio/clink.wav'),
    flip: new Audio('audio/flip.mp3'),
    applause: new Audio('audio/applause.mp3'),
    gameover: new Audio('audio/gameover.mp3'),
    gameMusic: new Audio('audio/gameMusic.mp3'),
  };

  private playing: Record<string, HTMLAudioElement[]> = {};

  play(sound: keyof typeof this.sounds, volume = 0.5) {
    const audio = this.sounds[sound].cloneNode() as HTMLAudioElement;
    audio.volume = volume;
    audio.play();
    if (!this.playing[sound]) {
      this.playing[sound] = [];
    }
    this.playing[sound].push(audio);
    audio.addEventListener('ended', () => {
      this.playing[sound] = this.playing[sound].filter((a) => a !== audio);
    });
  }
  stop(sound: keyof typeof this.sounds) {
    if (this.playing[sound]) {
      this.playing[sound].forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      this.playing[sound] = [];
    }
  }
}
