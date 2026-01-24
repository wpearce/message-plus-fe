import {Component, input, computed, output} from '@angular/core';
import type { MessageTemplate } from '../../core/models/message-template';
import {RouterLink} from '@angular/router';
import {ClipboardButtonComponent} from './clipboard-button.component';
import {TagListComponent} from './tag-list.component';

@Component({
  selector: 'mp-template',
  standalone: true,
  styleUrl: './template.component.scss',
  template: `
    <article class="card">
      <div class="icon-bar">
        <a
          class="icon-btn edit-btn"
          [routerLink]="['/templates', templateItem().id, 'edit']"
          aria-label="Edit Message"
          title="Edit"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
            <path
              d="M16.862 3.487a1.75 1.75 0 0 1 2.476 2.474l-1.04 1.04-2.475-2.475 1.04-1.04ZM14.77 5.58 5.62 14.73a2.5 2.5 0 0 0-.65 1.13l-.6 2.41a.75.75 0 0 0 .91.91l2.41-.6a2.5 2.5 0 0 0 1.13-.65L18.97 9.42 14.77 5.58Z"/>
          </svg>
        </a>

        <button
          type="button"
          class="icon-btn delete-btn"
          aria-label="Delete Message"
          title="Delete"
          (click)="requestDelete($event)"
        >
          <!-- trash icon -->
          <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
            <path
              fill="currentColor"
              d="M10 3h4a2 2 0 0 1 2 2v1h4a1 1 0 1 1 0 2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8H4a1 1 0 1 1 0-2h4V5a2 2 0 0 1 2-2Zm0 3h4V5H10v1Zm-3 2v13h10V8H7Z"
            />
            <path
              fill="currentColor"
              d="M9.5 11a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"
            />
          </svg>

        </button>
      </div>

      <h2 class="title">{{ templateItem().title }}</h2>

      @if (tags().length) {
        <mp-tag-list class="tags" [tags]="tags()"></mp-tag-list>
      }

      <section class="body">
        <div class="body-hdr">
          <h3>English</h3>
          <mp-clipboard-button [text]="safeBodyEn()"></mp-clipboard-button>
        </div>
        <pre class="text">{{ safeBodyEn() }}</pre>
      </section>

      <section class="body">
        <div class="body-hdr">
          <h3>Português</h3>
          <mp-clipboard-button [text]="safeBodyPt()"></mp-clipboard-button>
        </div>
        <pre class="text">{{ safeBodyPt() }}</pre>
      </section>
    </article>
  `,
  imports: [
    RouterLink, ClipboardButtonComponent, TagListComponent
  ]
})
export class TemplateItemComponent {
  templateItem = input.required<MessageTemplate>();

  deleteRequested = output<MessageTemplate>();

  safeBodyEn = computed(() => this.templateItem().bodyEn ?? '—');
  safeBodyPt = computed(() => this.templateItem().bodyPt ?? '—');

  tags = computed(() => this.templateItem().tags ?? []);

  requestDelete(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.deleteRequested.emit(this.templateItem());
  }
}
