// src/app/features/templates/template-item.component.ts
import { Component, input, computed } from '@angular/core';
import type { MessageTemplate } from '../../core/models/message-template';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'mp-template',
  standalone: true,
  styleUrl: './template.component.scss',
  template: `
    <article class="card">
      <a
        class="icon-btn edit-btn"
        [routerLink]="['/templates', templateItem().id, 'edit']"
        aria-label="Edit Message"
        title="Edit"
      >
        <!-- Heroicons Pencil (MIT) -->
        <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
          <path
            d="M16.862 3.487a1.75 1.75 0 0 1 2.476 2.474l-1.04 1.04-2.475-2.475 1.04-1.04ZM14.77 5.58 5.62 14.73a2.5 2.5 0 0 0-.65 1.13l-.6 2.41a.75.75 0 0 0 .91.91l2.41-.6a2.5 2.5 0 0 0 1.13-.65L18.97 9.42 14.77 5.58Z"/>
        </svg>
      </a>

      <h2 class="title">{{ templateItem().title }}</h2>

      <section class="body">
        <h3>English</h3>
        <pre class="text">{{ safeBodyEn() }}</pre>
      </section>

      <section class="body">
        <h3>Português</h3>
        <pre class="text">{{ safeBodyPt() }}</pre>
      </section>
    </article>
  `,
  imports: [
    RouterLink
  ]
})
export default class TemplateItemComponent {
  templateItem = input.required<MessageTemplate>();

  safeBodyEn = computed(() => this.templateItem().bodyEn ?? '—');
  safeBodyPt = computed(() => this.templateItem().bodyPt ?? '—');
}
