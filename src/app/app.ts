import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from './game/card/card';

@Component({
  selector: 'app',
  imports: [RouterOutlet, Card],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('super-paria-ng');
}
