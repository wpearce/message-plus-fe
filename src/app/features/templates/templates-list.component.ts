import {Component, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../core/services/template.service';
import { MessageTemplate } from '../../core/models/message-template';
import { catchError, tap, of } from 'rxjs';
import TemplateItemComponent from './template.component';
import {RouterLink} from '@angular/router';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
  selector: 'mp-templates-list',
  standalone: true,
  imports: [TemplateItemComponent, RouterLink],
  template: `
    <section class="container">
      <header class="toolbar">
        <h1>Message Templates / Modelos de mensagens</h1>
        <a class="btn primary" [routerLink]="['/templates','new']" aria-label="Create a new message">
          New message
        </a>
        <button class="btn" type="button" (click)="logout()">
          Logout
        </button>
      </header>

      @if (loading()) {
        <p>Loading…</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (templates().length === 0) {
        <p>No messages found.</p>
      } @else {
        <ul class="list">
          @for (t of templates(); track t.id) {
            <li>
              <mp-template [templateItem]="t"></mp-template>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .container {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: .75rem;
      margin-bottom: 1rem;
    }
    .toolbar h1 {
      margin: 0;
      font: var(--mat-sys-headline-small);
      color: var(--mat-sys-on-surface);
    }
    .toolbar .btn {
      margin-left: auto;
    }

    .btn {
      appearance: none;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low);
      color: var(--mat-sys-on-surface);
      padding: .5rem .75rem;
      border-radius: .75rem;
      text-decoration: none;
      line-height: 1;
    }
    .btn.primary {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border-color: color-mix(in oklab, var(--mat-sys-primary) 60%, transparent);
    }

    .list {
      list-style: none;
      padding: 0;
    }

    .list li {
      padding: .75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: .5rem;
      margin-bottom: .5rem;
    }

    .error {
      color: #b91c1c;
    }
  `]
})
export default class TemplatesListComponent {
  private readonly api = inject(TemplatesService);
  private readonly oidc = inject(OidcSecurityService);

  loading = signal(true);
  error = signal<string | null>(null);

  // toSignal auto-unsubscribes on destroy
  templates = toSignal<MessageTemplate[], MessageTemplate[]>(
    this.api.getAll().pipe(
      tap(() => this.loading.set(false)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to load templates.');
        console.error('Failed to load templates', err);
        return of([] as MessageTemplate[]);
      })
    ),
    { initialValue: [] as MessageTemplate[] });

  logout(): void {
    // logs out at Zitadel + clears local tokens (uses postLogoutRedirectUri from oidcConfig)
    this.oidc.logoff().subscribe();
  }
}
