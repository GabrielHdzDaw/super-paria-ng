import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./menu/main-menu-component/main-menu-component').then((m) => m.MainMenuComponent),
  },
  {
    path: 'play',
    loadComponent: () =>
      import('./game/game-controller/game-controller').then((m) => m.GameController),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];
