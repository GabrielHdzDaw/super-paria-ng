import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameController } from './game/game-controller/game-controller';

@Component({
  selector: 'app',
  imports: [RouterOutlet, GameController],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
