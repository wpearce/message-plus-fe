import {Component, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { TemplatesService } from '../../core/services/template.service';
import { MessageTemplate } from '../../core/models/message-template';
import { catchError, tap, of } from 'rxjs';
import TemplateItemComponent from './template.component';

@Component({
  selector: 'mp-templates-list',
  standalone: true,
  imports: [TemplateItemComponent],
  template: `
    <section class="container">
      <h1>Message Templates / Modelos de mensagens</h1>

      @if (loading()) {
        <p>Loading…</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (templates().length === 0) {
        <p>No messages found.</p>
      } @else {
        <ul class="list">
          @for (t of templates(); track t.id) {
            <li>
              <mp-template [templateItem]="t"></mp-template>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .container {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .list {
      list-style: none;
      padding: 0;
    }

    .list li {
      padding: .75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: .5rem;
      margin-bottom: .5rem;
    }

    .error {
      color: #b91c1c;
    }
  `]
})
export default class TemplatesListComponent {
  private readonly api = inject(TemplatesService);

  loading = signal(true);
  error = signal<string | null>(null);

  // toSignal auto-unsubscribes on destroy
  templates = toSignal<MessageTemplate[], MessageTemplate[]>(
    this.api.getAll().pipe(
      tap(() => this.loading.set(false)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to load templates.');
        console.error('Failed to load templates', err);
        return of([] as MessageTemplate[]);
      })
    ),
    { initialValue: [] as MessageTemplate[] });
}
