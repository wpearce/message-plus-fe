import {Component, computed, inject, signal, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../core/services/template.service';
import { MessageTemplate, Tag } from '../../core/models/message-template';
import {BehaviorSubject, catchError, combineLatest, filter, of, map, shareReplay, switchMap, tap} from 'rxjs';
import { TemplateItemComponent } from './template.component';
import {RouterLink} from '@angular/router';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {ConfirmDiscardDialogComponent} from './confirm-discard-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {TagFilterComponent} from './tag-filter.component';
import {TagService} from '../../core/services/tag.service';
import {AuthorizationService} from '../../core/services/authorization.service';

@Component({
  selector: 'mp-templates-list',
  standalone: true,
  imports: [TemplateItemComponent, RouterLink, TagFilterComponent, MatPaginatorModule],
  providers: [MatPaginatorIntl],
  template: `
    <section class="container">
      @if (isReadOnly()) {
        <div class="read-only-banner" role="status" aria-live="polite">
          Read-only mode
        </div>
      }

      <header class="toolbar ">
        <mp-tag-filter
          [availableTags]="availableTags()"
          [selectedTags]="selectedTags()"
          (selectionChanged)="onTagSelectionChanged($event)"
        ></mp-tag-filter>
        <div class="toolbar-actions">
          <button
            type="button"
            class="btn primary add-btn"
            [routerLink]="['/templates','new']"
            [disabled]="isReadOnly()"
            [title]="isReadOnly() ? 'Read-only mode' : 'Create a new message'"
            aria-label="Create a new message"
          >
            +
          </button>
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
        <p role="status">Loading…</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (templates().length === 0) {
        <p>No messages found.</p>
      } @else {
        <ul class="list">
          @for (t of templates(); track t.id) {
            <li>
              <mp-template [templateItem]="t"
                           [readOnly]="isReadOnly()"
                           (deleteRequested)="onDeleteRequested($event)">
              </mp-template>
            </li>
          }
        </ul>
      }
      <mat-paginator
        aria-label="Message template pages"
        [style.display]="loading() ? 'none' : null"
        [length]="totalElements()"
        [pageIndex]="pageIndex()"
        [pageSize]="pageSize()"
        [hidePageSize]="true"
        [disabled]="loading()"
        (page)="onPageChanged($event)"
      ></mat-paginator>
    </section>
  `,
  styles: [`
    mat-paginator {
      zoom: 1.15;
    }

    .container {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .read-only-banner {
      margin-bottom: 1rem;
      padding: .75rem 1rem;
      border-radius: .75rem;
      border: 1px solid color-mix(in oklab, var(--mat-sys-error) 35%, var(--mat-sys-outline-variant));
      background: color-mix(in oklab, var(--mat-sys-error) 10%, white);
      color: color-mix(in oklab, var(--mat-sys-error) 65%, var(--mat-sys-on-surface));
      font: var(--mat-sys-body-medium);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: .75rem;
      margin-bottom: 1rem;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .toolbar h1 {
      margin: 0;
      font: var(--mat-sys-headline-small);
      color: var(--mat-sys-on-surface);
    }
    .toolbar-actions {
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

    .btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      filter: grayscale(35%);
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
  private readonly tagService = inject(TagService);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly oidc = inject(OidcSecurityService);
  private readonly dialog = inject(MatDialog);

  private readonly paginator = viewChild(MatPaginator);
  private readonly paginatorIntl = inject(MatPaginatorIntl);
  private readonly query$ = new BehaviorSubject({ tagIds: [] as string[], pageIndex: 0 });

  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  readonly hasTemplatesWriteScope = toSignal(this.authorizationService.hasTemplatesWriteScope$, { initialValue: false });
  readonly isReadOnly = computed(() => !this.hasTemplatesWriteScope());

  loading = signal(true);
  error = signal<string | null>(null);
  selectedTags = signal<string[]>([]);
  availableTags = signal<Tag[]>([]);

  private readonly tags$ = this.tagService.getAll().pipe(
      tap((tags) => this.availableTags.set(tags)),
      catchError((err) => {
        console.error('Failed to load tags', err);
        this.error.set('Failed to load tags.');
        return of([] as Tag[]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  templates = toSignal<MessageTemplate[], MessageTemplate[]>(
    combineLatest([
      this.query$,
      this.tags$
    ]).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap(([query, tags]) => {
        const tagNames = query.tagIds
          .map((tagId: string) => tags.find((tag) => tag.id === tagId)?.name)
          .filter((tagName): tagName is string => Boolean(tagName));
        return this.api.getAll(tagNames, query.pageIndex, this.pageSize()).pipe(
          // A deletion (including one by another user) can remove the requested page.
          switchMap(page => {
            const lastPageIndex = Math.max(0, page.totalPages - 1);
            return page.number > lastPageIndex
              ? this.api.getAll(tagNames, lastPageIndex, page.size)
              : of(page);
          }),
          tap(page => {
            this.pageIndex.set(page.number);
            this.pageSize.set(page.size);
            this.totalElements.set(page.totalElements);
            this.totalPages.set(page.totalPages);
            this.paginatorIntl.changes.next();
            this.loading.set(false);
          }),
          map(page => page.content),
          catchError(err => {
            const paginator = this.paginator();
            if (paginator) paginator.pageIndex = this.pageIndex();
            this.loading.set(false);
            this.error.set('Failed to load templates.');
            console.error('Failed to load templates', err);
            return of([] as MessageTemplate[]);
          })
        );
      })
    ),
    { initialValue: [] as MessageTemplate[] }
  );

  constructor() {
    this.paginatorIntl.getRangeLabel = () =>
      `Page ${this.totalPages() === 0 ? 0 : this.pageIndex() + 1} of ${this.totalPages()}`;
  }

  onPageChanged(event: PageEvent): void {
    this.query$.next({ tagIds: this.selectedTags(), pageIndex: event.pageIndex });
  }

  onTagSelectionChanged(tags: string[]): void {
    this.selectedTags.set(tags);
    this.query$.next({ tagIds: tags, pageIndex: 0 });
  }

  onDeleteRequested(message: MessageTemplate): void {
    if (this.isReadOnly()) return;

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
      next: () => this.query$.next({ tagIds: this.selectedTags(), pageIndex: this.pageIndex() }),
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
