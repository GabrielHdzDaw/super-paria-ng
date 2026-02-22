import { Component, input } from '@angular/core';

@Component({
  selector: 'card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  value = input<string>();
  suit = input<string>();

  
}
