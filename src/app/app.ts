import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { EarthboundBgComponent } from './shared/earthbound-background/earthbound-background';
import { combinations } from './shared/earthbound-background/layer-combos';

@Component({
  selector: 'app',
  imports: [RouterOutlet, EarthboundBgComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  #router = inject(Router);
  #currentUrl = toSignal(
    this.#router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.#router.url },
  );
  shellMode = computed(() => {
    const url = this.#currentUrl();
    if (url.startsWith('/play')) return 'game';
    if (url.startsWith('/ranking')) return 'ranking';
    if (url.startsWith('/auth/register')) return 'register';
    if (url.startsWith('/auth/login')) return 'login';
    return 'menu';
  });

  layerCombination = combinations[Math.floor(Math.random() * (combinations.length - 1))];
  layer1 = this.layerCombination.layer1;
  layer2 = this.layerCombination.layer2;

  ngAfterViewInit() {
    const main = document.getElementById('parallax-main');
    const bg = document.getElementById('main');
    if (!main || !bg) return;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      main.style.transform = `translate3d(${-x * 2}px, ${-y * 2}px, 0)`;
      bg.style.transform = `translate3d(${x * 1}px, ${y * 1}px, 0)`;
    });
    window.addEventListener('mouseleave', () => {
      main.style.transform = '';
      bg.style.transform = '';
    });
  }
}
