import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { UserRegister } from '../interfaces/auth.interface';
import { EncodeBase64Directive } from 'src/app/shared/directives/encode-base-64';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'register',
  imports: [RouterLink, FormField, EncodeBase64Directive],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  registerData = signal<UserRegister>({
    name: '',
    email: '',
    password: '',
    img: '',
  });

  registerForm = form(this.registerData);

  setImg(img: string) {
    this.registerData.update((data) => ({
      ...data,
      img,
    }));
  }

  submitRegister() {
    this.#authService
      .register(this.registerData())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigateByUrl('/auth/login');
        },
        error: (error) => console.log(error),
      });
  }
}
