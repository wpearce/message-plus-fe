import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/templates/templates-list.component'),
  },
  { path: '**', redirectTo: '' },
];
