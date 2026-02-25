import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameController } from './game/game-controller/game-controller';
import { EarthboundBgComponent } from './game/earthbound-background/earthbound-background';

@Component({
  selector: 'app',
  imports: [RouterOutlet, GameController, EarthboundBgComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  layer1 = Math.floor(Math.random() * 321)
  layer2 = Math.floor(Math.random() * 321)
}
