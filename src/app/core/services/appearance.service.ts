import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Appearance = 'current' | 'signal';
export const APPEARANCE_STORAGE_KEY = 'messageplus.appearance';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly document = inject(DOCUMENT);
  private readonly selected = signal<Appearance>(this.restore());
  readonly appearance = this.selected.asReadonly();

  constructor() {
    this.apply();
  }

  toggle(): void {
    this.selected.update(value => value === 'current' ? 'signal' : 'current');
    this.apply();
    try {
      this.document.defaultView?.localStorage.setItem(APPEARANCE_STORAGE_KEY, this.selected());
    } catch {
      // Appearance still works when browser storage is unavailable or full.
    }
  }

  private restore(): Appearance {
    try {
      return this.document.defaultView?.localStorage.getItem(APPEARANCE_STORAGE_KEY) === 'signal'
        ? 'signal' : 'current';
    } catch {
      return 'current';
    }
  }

  private apply(): void {
    // The document root also themes Material dialogs rendered outside the app root.
    this.document.documentElement.dataset['appearance'] = this.selected();
  }
}
