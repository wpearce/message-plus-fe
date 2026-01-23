import { Component, input } from '@angular/core';

@Component({
  selector: 'mp-tag',
  standalone: true,
  template: `<span class="tag" [title]="name()">{{ name() }}</span>`,
  styles: [`
    :host {
      display: inline-block;
    }

    .tag {
      display: inline-flex;
      align-items: center;

      padding: 2px 10px;
      border-radius: 999px;

      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);

      border: 1px solid color-mix(in oklab, var(--mat-sys-secondary) 30%, transparent);

      font: var(--mat-sys-label-medium);
      line-height: 20px;
      white-space: nowrap;
    }
  `]
})
export class TagComponent {
  name = input.required<string>();
}
