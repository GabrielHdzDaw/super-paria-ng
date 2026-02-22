import { Component, effect, input, signal } from '@angular/core';
import { Card } from '../card/card';
import { Deck, Suit, Value, CardInterface } from '../interfaces/deck.interface';

@Component({
  selector: 'game-controller',
  imports: [Card],
  templateUrl: './game-controller.html',
  styleUrl: './game-controller.css',
})
export class GameController {
  suits: Suit[] = ['S', 'H', 'D', 'C'];
  values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  firstCard = signal<number | null>(null);
  secondCard = signal<number | null>(null);

  locked = signal<boolean>(false);

  matchedIndices = signal<number[]>([]);
  flippedIndices = signal<number[]>([]);

  resetDelay = input<number>();

  constructor() {
    effect(() => {
      this.flippedIndices();
      if (this.flippedIndices().length === 16) {
        alert('You win');
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

  reset() {
    this.firstCard.set(null);
    this.secondCard.set(null);
    this.locked.set(false);
  }
}
