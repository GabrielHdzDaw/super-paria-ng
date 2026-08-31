import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EncodeBase64Directive } from 'src/app/shared/directives/encode-base-64';
import { UserRegister } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'register',
  imports: [RouterLink, FormField, EncodeBase64Directive, SwalComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  swalConfirm = viewChild.required<SwalComponent>('swalConfirm');
  swalError = viewChild.required<SwalComponent>('swalError');

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
        next: async () => {
          await this.swalConfirm().fire();
          this.#router.navigateByUrl('/auth/login');
        },
        error: async (error) => {
          await this.swalError().fire();
          console.log(error);
        },
      });
  }
}
