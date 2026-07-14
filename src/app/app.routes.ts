import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'mainmenu',
    loadChildren: () =>
      import('./menu/main-menu-component/main-menu-component').then((m) => m.MainMenuComponent),
  },
  {
    path: 'play',
    loadChildren: () =>
      import('./game/game-controller/game-controller').then((m) => m.GameController),
  },
  { path: '', redirectTo: '/mainmenu', pathMatch: 'full' },
  { path: '**', redirectTo: '/mainmenu' },
];
