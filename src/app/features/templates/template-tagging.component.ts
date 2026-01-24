import { Component, computed, inject, input, output, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TemplatesService } from '../../core/services/template.service';

interface TagOption {
  id: string;
  name: string;
}

@Component({
  selector: 'mp-template-tagging',
  standalone: true,
  template: `
    <section class="tagging">
      <div class="tagging__header">
        <span class="lbl">Tags</span>
        @if (isDisabled()) {
          <span class="hint">Save the template before assigning tags.</span>
        }
      </div>
      <div class="tagging__list">
        @for (tag of availableTags; track tag.id) {
          <button
            type="button"
            class="tagging__item"
            [class.is-selected]="isSelected(tag)"
            [attr.aria-pressed]="isSelected(tag)"
            [disabled]="isDisabled() || isBusy(tag)"
            (click)="toggle(tag)"
          >
            {{ tag.name }}
          </button>
        }
      </div>
      @if (error()) {
        <div class="err">{{ error() }}</div>
      }
    </section>
  `,
  styles: [`
    .tagging {
      margin-top: 1rem;
      display: grid;
      gap: 0.5rem;
    }

    .tagging__header {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .hint {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }

    .tagging__list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tagging__item {
      appearance: none;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low);
      color: var(--mat-sys-on-surface);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font: var(--mat-sys-label-medium);
      line-height: 1.5;
      cursor: pointer;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
    }

    .tagging__item.is-selected {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      border-color: color-mix(in oklab, var(--mat-sys-secondary) 40%, transparent);
    }

    .tagging__item:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `],
})
export class TemplateTaggingComponent {
  private readonly templatesService = inject(TemplatesService);

  readonly availableTags: TagOption[] = [
    { id: 'BEM-VINDO', name: 'BEM-VINDO' },
    { id: 'DESPEDIDA', name: 'DESPEDIDA' },
    { id: 'INFO', name: 'INFO' },
    { id: 'JAUÁ', name: 'JAUÁ' },
    { id: 'BARRA', name: 'BARRA' },
    { id: 'PERDĀO', name: 'PERDĀO' },
  ];

  templateId = input<string | null>(null);
  selectedTags = input<readonly string[]>([]);
  tagsUpdated = output<string[]>();

  readonly busyTags = signal<readonly string[]>([]);
  readonly error = signal<string | null>(null);
  readonly isDisabled = computed(() => !this.templateId());

  isSelected(tag: TagOption): boolean {
    return this.selectedTags().includes(tag.name);
  }

  isBusy(tag: TagOption): boolean {
    return this.busyTags().includes(tag.id);
  }

  toggle(tag: TagOption): void {
    const templateId = this.templateId();
    if (!templateId || this.isBusy(tag)) return;

    this.error.set(null);
    this.busyTags.set([...this.busyTags(), tag.id]);
    const selected = this.isSelected(tag);
    const request$ = selected
      ? this.templatesService.unlinkTag(templateId, tag.id)
      : this.templatesService.linkTag(templateId, tag.id);

    request$
      .pipe(
        finalize(() => {
          this.busyTags.set(this.busyTags().filter((id) => id !== tag.id));
        })
      )
      .subscribe({
        next: () => {
          const current = this.selectedTags();
          const updated = selected
            ? current.filter((name) => name !== tag.name)
            : [...current, tag.name];
          this.tagsUpdated.emit(updated);
        },
        error: () => {
          this.error.set('Failed to update tag.');
        },
      });
  }
}
