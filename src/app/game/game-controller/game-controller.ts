import { Component, effect, input, OnInit, signal } from '@angular/core';
import { Card } from '../card/card';
import { Deck, Suit, Value, CardInterface } from '../interfaces/deck.interface';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

import Engine from 'src/assets/eb/src/engine';
import Rom from 'src/assets/eb/src/rom/rom';
import BackgroundLayer from 'src/assets/eb/src/rom/background_layer';

@Component({
  selector: 'game-controller',
  imports: [Card],
  templateUrl: './game-controller.html',
  styleUrl: './game-controller.css',
})
export class GameController implements OnInit {
  readonly CARD_DELAY = 80;
  readonly ANIMATION_DURATION = 500;
  readonly PREVIEW_DURATION = 1000;
  timeLeft = signal<number>(93);
  #timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startDealAnimation();
    this.startTimer();
  }

  suits: Suit[] = ['S', 'H', 'D', 'C'];
  values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  firstCard = signal<number | null>(null);
  secondCard = signal<number | null>(null);

  locked = signal<boolean>(false);

  matchedIndices = signal<number[]>([]);
  flippedIndices = signal<number[]>([]);

  resetDelay = input<number>();

  dealAnimationActive = signal<boolean>(true);
  previewActive = signal<boolean>(false);

  startTimer() {
    this.#timerInterval = setInterval(() => {
      this.timeLeft.update((t) => t - 1);
      console.log(this.timeLeft());
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
      if (this.flippedIndices().length === 16) {
        this.stopTimer();
        alert('You win');
      }
    });
    effect(() => {
      this.timeLeft();
      if (this.timeLeft() === 0) {
        alert("Time's over. You lose.");
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

    if (this.firstCard() === null) {
      this.firstCard.set(index);
      this.flippedIndices.update((i) => [...i, index]);
    } else {
      this.secondCard.set(index);
      this.flippedIndices.update((i) => [...i, index]);
      this.locked.set(true);

      const first = this.gameDeck[this.firstCard()!];
      const second = this.gameDeck[index];

      if (first.suit === second.suit && first.value === second.value) {
        this.matchedIndices.update((i) => [...i, this.firstCard()!, index]);
        this.reset();
      } else {
        setTimeout(() => {
          this.flippedIndices.update((i) => i.filter((i) => i !== this.firstCard() && i !== index));
          this.reset();
        }, this.resetDelay());
      }
    }
  }

  startDealAnimation() {
    this.dealAnimationActive.set(true);
    this.previewActive.set(false);

    const dealDuration = (this.gameDeck.length - 1) * this.CARD_DELAY + this.ANIMATION_DURATION;

    setTimeout(() => {
      this.previewActive.set(true);
    }, dealDuration);

    setTimeout(() => {
      this.previewActive.set(false);
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
    this.timeLeft.set(93);
    this.matchedIndices.set([]);
    this.flippedIndices.set([]);
    this.firstCard.set(null);
    this.secondCard.set(null);
    this.locked.set(false);
    this.gameDeck = this.generateGameDeck(this.deck);
    this.startDealAnimation();
  }
}
