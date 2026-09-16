import { Routes } from '@angular/router';
import { TemplateEditComponent } from './features/templates/template-edit.component';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { pendingChangesGuard } from './core/guards/pending-changes.guard';
import { templatesWriteGuard } from './core/guards/templates-write.guard';

export const routes: Routes = [
  // public routes
  {
    path: 'guide/registration',
    loadComponent: () => import('./features/registration-guide/registration-guide.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/registration-guide/registration-guide-redirect.component'),
      },
      {
        path: ':step',
        loadComponent: () =>
          import('./features/registration-guide/registration-guide-step.component'),
      },
    ],
  },

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
      {
        path: 'templates/new',
        component: TemplateEditComponent,
        canActivate: [templatesWriteGuard],
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'templates/:id/edit',
        component: TemplateEditComponent,
        canActivate: [templatesWriteGuard],
        canDeactivate: [pendingChangesGuard],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
