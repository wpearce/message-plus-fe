import { Routes } from '@angular/router';
import {TemplateEditComponent} from './features/templates/template-edit.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/templates/templates-list.component'),
  },
  { path: 'templates/new', component: TemplateEditComponent },
  { path: 'templates/:id/edit', component: TemplateEditComponent },
  { path: '**', redirectTo: '' },
];
