import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'mp-clipboard-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="icon-btn copy-btn"
      aria-label="Copy to clipboard"
      title="Copy"
      (click)="copy()"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
        <path
          fill="currentColor"
          d="M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Zm6 3V5H9v1h6Zm3 2H6v11h12V8Z"
        />
      </svg>
    </button>

    @if (copied()) {
      <span class="copied-hint">Copied</span>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .copied-hint {
      font: var(--mat-sys-label-small);
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
    }
  `]
})
export class ClipboardButtonComponent {
  text = input.required<string>();

  copied = signal(false);

  async copy() {
    try {
      await navigator.clipboard.writeText(this.text());
    } catch {
      // Safari / fallback
      const ta = document.createElement('textarea');
      ta.value = this.text();
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1000);
  }
}
