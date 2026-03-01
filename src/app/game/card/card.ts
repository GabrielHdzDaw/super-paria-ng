import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';

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
export class Card implements AfterViewInit, OnDestroy {
  value = input<string>();
  suit = input<string>();
  isFlipped = input<boolean>(false);
  matched = input<boolean>(false);

  flipRequest = output<void>();
  pipPositions = computed(() => PIP_POSITIONS[this.value() ?? ''] ?? []);

  @ViewChild('cardContainer') cardContainer!: ElementRef;

  private glareEl!: HTMLElement;
  private tiltX = 0;
  private tiltY = 0;
  private rafId: number | null = null;
  private el!: HTMLElement;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.el = this.cardContainer.nativeElement;

    this.glareEl = document.createElement('div');
    this.glareEl.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.15s ease-out;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 70%);
    `;
    this.el.appendChild(this.glareEl);

    this.ngZone.runOutsideAngular(() => {
      this.el.addEventListener('mousemove', this.onMouseMove);
      this.el.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  ngOnDestroy() {
    this.el.removeEventListener('mousemove', this.onMouseMove);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.glareEl?.remove();
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.rafId = requestAnimationFrame(() => {
      const rect = this.el.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      const maxTilt = 18;
      this.tiltX = -relY * maxTilt;
      this.tiltY = relX * maxTilt;

      this.el.style.transform =
        `perspective(600px) rotateX(${this.tiltX}deg) rotateY(${this.tiltY}deg) scale(1.05)`;

      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      const dist = Math.sqrt(relX * relX + relY * relY) / Math.sqrt(2);
      const maxGlare = 0.45;

      this.glareEl.style.opacity = (dist * maxGlare).toString();
      this.glareEl.style.background =
        `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 65%)`;
    });
  };

  private onMouseLeave = () => {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    this.glareEl.style.opacity = '0';
  };
}