import { Routes } from '@angular/router';
import {TemplateEditComponent} from './features/templates/template-edit.component';
import {autoLoginPartialRoutesGuard} from 'angular-auth-oidc-client';
import {pendingChangesGuard} from './core/guards/pending-changes.guard';

export const routes: Routes = [
  // public routes

  // protected area
  {
    path: '',
    canMatch: [autoLoginPartialRoutesGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/templates/templates-list.component'),
      },
      {path: 'templates/new', component: TemplateEditComponent, canDeactivate: [pendingChangesGuard],},
      {path: 'templates/:id/edit', component: TemplateEditComponent, canDeactivate: [pendingChangesGuard],},
    ],
  },

  { path: '**', redirectTo: '' },
];
