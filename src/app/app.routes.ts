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
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'ranking',
    loadComponent: () =>
      import('./ranking/ranking-component/ranking-component').then((m) => m.RankingComponent),
  },

  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];
