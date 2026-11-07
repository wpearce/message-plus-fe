import { Component, inject } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { AppearanceService } from './core/services/appearance.service';

@Component({
  selector: 'mp-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="shell">
      <a class="brand" routerLink="/">Message+</a>
      <label class="appearance-toggle">
        <span>New UI</span>
        <input
          type="checkbox"
          role="switch"
          class="appearance-switch"
          [checked]="appearance.appearance() === 'signal'"
          (change)="appearance.toggle()"
        />
      </label>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .shell {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand { font-weight: 600; text-decoration: none; font-size: 1.3rem; }
    .appearance-toggle {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      min-height: 40px;
      color: var(--mat-sys-on-surface);
      font: var(--mat-sys-label-large);
      cursor: pointer;
    }
    .appearance-switch {
      appearance: none;
      flex-shrink: 0;
      width: 44px;
      height: 24px;
      margin: 0;
      padding: 2px;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 999px;
      background: var(--mat-sys-surface-container-highest);
      cursor: pointer;
    }
    .appearance-switch::before {
      content: '';
      display: block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--mat-sys-on-surface-variant);
    }
    .appearance-switch:checked {
      background: var(--mat-sys-primary);
      border-color: var(--mat-sys-primary);
    }
    .appearance-switch:checked::before {
      transform: translateX(20px);
      background: var(--mat-sys-on-primary);
    }
    .appearance-switch:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 3px;
    }
    main { padding: 1rem; }
  `]
})
export class AppComponent {
  readonly appearance = inject(AppearanceService);
}
