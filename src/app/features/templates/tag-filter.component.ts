import { Component, input, output } from '@angular/core';
import { Tag } from '../../core/models/message-template';

@Component({
  selector: 'mp-tag-filter',
  standalone: true,
  template: `
    <div class="tag-filter">
      @for (tag of availableTags(); track tag.id) {
        <button
          type="button"
          class="tag-filter__item"
          [class.is-selected]="isSelected(tag.id)"
          [attr.aria-pressed]="isSelected(tag.id)"
          (click)="toggle(tag.id)"
        >
          {{ tag.name }}
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
  availableTags = input<readonly Tag[]>([]);
  selectedTags = input<readonly string[]>([]);
  selectionChanged = output<string[]>();

  isSelected(tagId: string): boolean {
    return this.selectedTags().includes(tagId);
  }

  toggle(tagId: string): void {
    const currentSelection = this.selectedTags();
    const updatedSelection = currentSelection.includes(tagId)
      ? currentSelection.filter((item) => item !== tagId)
      : [...currentSelection, tagId];
    this.selectionChanged.emit(updatedSelection);
  }
}
