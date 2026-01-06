import {Component, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../core/services/template.service';
import { MessageTemplate } from '../../core/models/message-template';
import {catchError, tap, of, startWith, switchMap, Subject, filter} from 'rxjs';
import TemplateItemComponent from './template.component';
import {RouterLink} from '@angular/router';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {ConfirmDiscardDialogComponent} from './confirm-discard-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'mp-templates-list',
  standalone: true,
  imports: [TemplateItemComponent, RouterLink],
  template: `
    <section class="container">
      <header class="toolbar ">
        <div class="toolbar-actions">
          <a class="btn primary add-btn" [routerLink]="['/templates','new']" aria-label="Create a new message">
            +
          </a>
          <button class="icon-btn" type="button" (click)="logout()">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
              <!-- exit/logout icon -->
              <path
                fill="currentColor"
                d="M10 7a1 1 0 0 1 1-1h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7a1 1 0 1 1 0-2h7V8h-7a1 1 0 0 1-1-1Z"
              />
              <path
                fill="currentColor"
                d="M12.7 12 9.4 8.7a1 1 0 1 0-1.4 1.4l1.6 1.6H4a1 1 0 1 0 0 2h5.6l-1.6 1.6a1 1 0 1 0 1.4 1.4L12.7 12Z"
              />
            </svg>
          </button>
        </div>
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
              <mp-template [templateItem]="t"
                           (deleteRequested)="onDeleteRequested($event)">
              </mp-template>
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

    .toolbar-actions {
      margin-left: auto;           /* pushes the whole group to the right */
      display: inline-flex;
      align-items: center;
      gap: .8rem;                  /* keeps + and logout close together */
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

    .add-btn {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1;
      padding-inline: 0.75rem;
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
  private readonly dialog = inject(MatDialog);

  private readonly refresh$ = new Subject<void>();

  loading = signal(true);
  error = signal<string | null>(null);

  templates = toSignal<MessageTemplate[], MessageTemplate[]>(
    this.refresh$.pipe(
      startWith(void 0),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap(() =>
        this.api.getAll().pipe(
          tap(() => this.loading.set(false)),
          catchError(err => {
            this.loading.set(false);
            this.error.set('Failed to load templates.');
            console.error('Failed to load templates', err);
            return of([] as MessageTemplate[]);
          })
        )
      )
    ),
    { initialValue: [] as MessageTemplate[] }
  );

  onDeleteRequested(message: MessageTemplate): void {
    const ref = this.dialog.open(ConfirmDiscardDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'Delete message?',
        message: `Do you really want to delete "${message.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    ref.afterClosed().pipe(
      filter((confirmed: boolean) => confirmed),
      switchMap(() => this.api.delete(String(message.id)))
    ).subscribe({
      next: () => this.refresh$.next(),
      error: (err) => {
        console.error('Failed to delete template', err);
        this.error.set('Failed to delete template.');
      },
    });
  }

  logout(): void {
    // logs out at Zitadel + clears local tokens (uses postLogoutRedirectUri from oidcConfig)
    this.oidc.logoff().subscribe();
  }
}
