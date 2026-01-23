import { Component, input, output } from '@angular/core';

@Component({
  selector: 'mp-tag-filter',
  standalone: true,
  template: `
    <div class="tag-filter">
      @for (tag of availableTags; track tag) {
        <button
          type="button"
          class="tag-filter__item"
          [class.is-selected]="isSelected(tag)"
          [attr.aria-pressed]="isSelected(tag)"
          (click)="toggle(tag)"
        >
          {{ tag }}
        </button>
      }
    </div>
  `,
  styles: [`
    .tag-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .tag-filter__item {
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

    .tag-filter__item.is-selected {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      border-color: color-mix(in oklab, var(--mat-sys-secondary) 40%, transparent);
    }
  `]
})
export class TagFilterComponent {
  readonly availableTags = ['BEM-VINDO', 'DESPEDIDA', 'INFO', 'JAUÁ', 'BARRA', 'PERDĀO'];

  selectedTags = input<readonly string[]>([]);
  selectionChanged = output<string[]>();

  isSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  toggle(tag: string): void {
    const currentSelection = this.selectedTags();
    const updatedSelection = currentSelection.includes(tag)
      ? currentSelection.filter((item) => item !== tag)
      : [...currentSelection, tag];
    this.selectionChanged.emit(updatedSelection);
  }
}
