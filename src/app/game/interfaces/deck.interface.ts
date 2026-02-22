export type Suit = 'S' | 'H' | 'D' | 'C';
export type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardInterface {
  suit: Suit;
  value: Value;
}

export interface Deck {
  cards: CardInterface[];
}
