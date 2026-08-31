import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserLogin } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'login',
  imports: [FormsModule, RouterLink, FormField, SwalComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  swalConfirm = viewChild.required<SwalComponent>('swalConfirm');
  swalError = viewChild.required<SwalComponent>('swalError');

  loginData = signal<UserLogin>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginData);

  submitLogin() {
    this.#authService
      .login(this.loginData())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: async () => {
          await this.swalConfirm().fire();
          this.#router.navigateByUrl('/');
        },
        error: async (error) => {
          await this.swalError().fire();
          console.log(error);
        },
      });
  }
}
