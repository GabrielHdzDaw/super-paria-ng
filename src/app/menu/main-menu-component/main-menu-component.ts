import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service';
import { SoundService } from 'src/app/shared/sound-service';

@Component({
  selector: 'main-menu-component',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './main-menu-component.html',
  styleUrl: './main-menu-component.css',
})
export class MainMenuComponent implements OnInit {
  soundService = inject(SoundService);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  user = this.#authService.getUser();

  isLogged = this.#authService.isLogged().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();

  ngOnInit(): void {
    this.soundService.stop('gameMusic');
  }

  logout() {
    this.#authService.logout();
  }
}
