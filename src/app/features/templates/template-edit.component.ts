import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TemplatesService } from '../../core/services/template.service';
import { MessageTemplate } from '../../core/models/message-template';

@Component({
  selector: 'mp-template-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private templatesService = inject(TemplatesService);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    bodyEn: [''],
    bodyPt: [''],
  });

  constructor() {
    this.templatesService.getById(this.id).subscribe({
      next: (t) => {
        this.form.reset({
          title: t.title ?? '',
          bodyEn: t.bodyEn ?? '',
          bodyPt: t.bodyPt ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load template.');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const patch: Partial<MessageTemplate> = this.form.getRawValue();
    this.templatesService.update(this.id, patch).subscribe({
      next: () => this.router.navigate(['/templates', this.id]),
      error: () => {
        this.error.set('Failed to save changes.');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/templates', this.id]);
  }
}
