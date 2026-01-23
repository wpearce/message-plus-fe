import { Component, computed, input } from '@angular/core';
import { TagComponent } from './tag.component';

type TagLike = string | { name?: string | null } | null | undefined;

@Component({
  selector: 'mp-tag-list',
  standalone: true,
  imports: [TagComponent],
  template: `
    @if (names().length) {
      @for (name of names(); track name) {
        <mp-tag [name]="name"></mp-tag>
      }
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  `]
})
export class TagListComponent {
  tags = input<readonly TagLike[] | null | undefined>(null);

  readonly names = computed(() =>
    (this.tags() ?? [])
      .map((t) => (typeof t === 'string' ? t : t?.name) ?? '')
      .map((s) => s.trim())
      .filter(Boolean)
  );
}
