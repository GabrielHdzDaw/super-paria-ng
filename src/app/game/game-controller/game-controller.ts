import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { Card } from '../card/card';
import { Deck, Suit, Value, CardInterface } from '../interfaces/deck.interface';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { ComboComponent } from '../combo-component/combo-component';
import { Combo } from '../interfaces/combo.interface';
import { SoundService } from 'src/app/shared/sound-service';

@Component({
  selector: 'game-controller',
  imports: [Card, ComboComponent],
  templateUrl: './game-controller.html',
  styleUrl: './game-controller.css',
})
export class GameController implements OnInit {
  soundService = inject(SoundService);
  readonly CARD_DELAY = 80;
  readonly ANIMATION_DURATION = 500;
  readonly PREVIEW_DURATION = 1000;
  timeLeft = signal<number>(93);
  #timerInterval: ReturnType<typeof setInterval> | null = null;

  scoreTime = 0;

  ngOnInit() {
    this.startDealAnimation();
    this.startTimer();
  }

  suits: Suit[] = ['S', 'H', 'D', 'C'];
  values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  firstCard = signal<number | null>(null);
  secondCard = signal<number | null>(null);

  locked = signal<boolean>(false);
  flash = signal<boolean>(false);

  matchedIndices = signal<number[]>([]);
  flippedIndices = signal<number[]>([]);

  currentCombo = signal<number>(0);

  totalCombos = signal<Combo[]>([]);

  resetDelay = input<number>();

  dealAnimationActive = signal<boolean>(true);
  previewActive = signal<boolean>(false);

  rumble = signal<boolean>(false);

  startTimer() {
    this.#timerInterval = setInterval(() => {
      this.timeLeft.update((t) => t - 1);
      if (this.timeLeft() === 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.#timerInterval) {
      clearInterval(this.#timerInterval);
      this.#timerInterval = null;
      this.locked.set(true);
    }
  }

  constructor() {
    effect(() => {
      this.flippedIndices();
      if (this.flippedIndices().length === this.gameDeck.length) {
        this.scoreTime = this.timeLeft();
        console.log(this.totalCombos());
        this.stopTimer();
        this.locked.set(true);
        this.soundService.play('applause', 0.1);
      }
    });
    effect(() => {
      this.timeLeft();
      if (this.timeLeft() <= 0) {
        this.stopTimer();
        this.soundService.play('gameover', 0.1);
      }
    });
  }

  deck: Deck = {
    cards: this.suits.flatMap((suit) => this.values.map((value) => ({ suit, value }))),
  };

  gameDeck = this.generateGameDeck(this.deck);

  generateGameDeck(deck: Deck): CardInterface[] {
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 8);
    return [...selected, ...selected].sort(() => Math.random() - 0.5);
  }

  flipCard(index: number) {
    if (this.locked()) return;
    if (this.matchedIndices().includes(index)) return;
    if (this.firstCard() === index) return;

    this.soundService.play('flip', 0.1);

    if (this.firstCard() === null) {
      this.soundService.play('flip', 0.1);
      this.firstCard.set(index);
      this.flippedIndices.update((i) => [...i, index]);
    } else {
      this.secondCard.set(index);
      this.flippedIndices.update((i) => [...i, index]);
      this.locked.set(true);

      const first = this.gameDeck[this.firstCard()!];
      const second = this.gameDeck[index];

      if (this.checkMatch(first, second)) {
        this.currentCombo.update((c) => c + 1);
        this.flash.set(true);
        this.rumble.set(true);
        setTimeout(() => {
          this.flash.set(false);
        }, 50);

        this.soundService.play('match', 0.1);
        this.matchedIndices.update((i) => [...i, this.firstCard()!, index]);
        this.reset();
      } else {
        if (this.currentCombo() > 2) {
          this.soundService.play('scratch', 0.1);
        }
        this.currentCombo.set(0);
        setTimeout(() => {
          this.flippedIndices.update((i) => i.filter((i) => i !== this.firstCard() && i !== index));
          this.soundService.play('flip', 0.1);
          this.reset();
        }, this.resetDelay());
      }
    }
  }

  checkMatch(cardA: CardInterface, cardB: CardInterface): boolean {
    return cardA.suit === cardB.suit && cardA.value === cardB.value;
  }

  addCombo(combo: Combo) {
    this.totalCombos.update((c) => [...c, combo]);
  }

  startDealAnimation() {
    this.dealAnimationActive.set(true);
    this.previewActive.set(false);
    for (let i = 0; i < this.gameDeck.length; i++) {
      setTimeout(() => {
        this.soundService.play('flip', 0.1);
      }, i * this.CARD_DELAY);
    }

    const dealDuration = (this.gameDeck.length - 1) * this.CARD_DELAY + this.ANIMATION_DURATION;

    setTimeout(() => {
      this.previewActive.set(true);
      this.soundService.play('flip', 0.1);
    }, dealDuration);

    setTimeout(() => {
      this.previewActive.set(false);
      this.soundService.play('flip', 0.1);
      setTimeout(() => {
        this.dealAnimationActive.set(false);
      }, 500);
    }, dealDuration + this.PREVIEW_DURATION);
  }

  reset() {
    this.firstCard.set(null);
    this.secondCard.set(null);
    this.locked.set(false);
  }

  resetGame() {
    this.stopTimer();
    this.timeLeft.set(93);
    this.currentCombo.set(0);
    this.totalCombos.set([]);
    this.matchedIndices.set([]);
    this.flippedIndices.set([]);
    this.firstCard.set(null);
    this.secondCard.set(null);
    this.locked.set(false);
    this.gameDeck = this.generateGameDeck(this.deck);
    this.startDealAnimation();
    this.startTimer();
  }
  debug(suit, value) {
    console.log(suit, value);
  }
}
