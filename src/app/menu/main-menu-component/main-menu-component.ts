import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user-service';

@Component({
  selector: 'main-menu-component',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './main-menu-component.html',
  styleUrl: './main-menu-component.css',
})
export class MainMenuComponent {
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #userService = inject(UserService);

  user = signal<User | undefined>(undefined);

  isLogged = this.#authService
    .isLogged()
    .pipe(
      switchMap((logged) => (logged ? this.#userService.getUser() : of(undefined))),
      takeUntilDestroyed(this.#destroyRef),
    )
    .subscribe({
      next: (user) => {
        console.log(user);
        this.user.set(user);
      },
      error: () => this.user.set(undefined),
    });

  logout() {
    this.#authService.logout();
    this.user.set(undefined);
  }
}
