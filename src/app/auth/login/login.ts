import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { UserLogin } from '../interfaces/auth.interface';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  #router = inject(Router);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  loginData = signal<UserLogin>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginData);
}
