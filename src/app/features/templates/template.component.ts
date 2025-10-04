// src/app/features/templates/template-item.component.ts
import { Component, input, computed } from '@angular/core';
import type { MessageTemplate } from '../../core/models/message-template';

@Component({
  selector: 'mp-template',
  standalone: true,
  styleUrl: './template.component.scss',
  template: `
    <article class="card">
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
})
export default class TemplateItemComponent {
  templateItem = input.required<MessageTemplate>();

  safeBodyEn = computed(() => this.templateItem().bodyEn ?? '—');
  safeBodyPt = computed(() => this.templateItem().bodyPt ?? '—');
}
