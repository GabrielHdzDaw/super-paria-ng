import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

const PIP_POSITIONS: Record<string, [number, number][]> = {
  A: [[2, 3]],
  '2': [
    [2, 1],
    [2, 5],
  ],
  '3': [
    [2, 1],
    [2, 3],
    [2, 5],
  ],
  '4': [
    [1, 1],
    [3, 1],
    [1, 5],
    [3, 5],
  ],
  '5': [
    [1, 1],
    [3, 1],
    [2, 3],
    [1, 5],
    [3, 5],
  ],
  '6': [
    [1, 1],
    [3, 1],
    [1, 3],
    [3, 3],
    [1, 5],
    [3, 5],
  ],
  '7': [
    [1, 1],
    [3, 1],
    [2, 2],
    [1, 3],
    [3, 3],
    [1, 5],
    [3, 5],
  ],
  '8': [
    [1, 1],
    [3, 1],
    [2, 2],
    [1, 3],
    [3, 3],
    [2, 4],
    [1, 5],
    [3, 5],
  ],
  '9': [
    [1, 1],
    [3, 1],
    [1, 2],
    [3, 2],
    [2, 3],
    [1, 4],
    [3, 4],
    [1, 5],
    [3, 5],
  ],
  '10': [
    [1, 1],
    [3, 1],
    [2, 2],
    [1, 2],
    [3, 2],
    [1, 4],
    [3, 4],
    [2, 4],
    [1, 5],
    [3, 5],
  ],
  J: [[2, 3]],
  Q: [[2, 3]],
  K: [[2, 3]],
};

@Component({
  selector: 'card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  value = input<string>();
  suit = input<string>();
  isFlipped = input<boolean>(false);

  flipRequest = output<void>();
  pipPositions = computed(() => PIP_POSITIONS[this.value() ?? ''] ?? []);
}
