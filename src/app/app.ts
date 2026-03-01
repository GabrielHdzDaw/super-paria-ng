import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameController } from './game/game-controller/game-controller';
import { EarthboundBgComponent } from './shared/earthbound-background/earthbound-background';
import { combinations } from './shared/earthbound-background/layer-combos';

@Component({
  selector: 'app',
  imports: [RouterOutlet, GameController, EarthboundBgComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
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
