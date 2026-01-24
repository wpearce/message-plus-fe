import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TemplatesService} from '../../core/services/template.service';
import {MessageTemplate} from '../../core/models/message-template';
import {Language} from '../../helpers/enums';
import {TagListComponent} from './tag-list.component';
import {TemplateTaggingComponent} from './template-tagging.component';
import {TagService} from '../../core/services/tag.service';
import {Tag} from '../../core/models/message-template';

@Component({
  selector: 'mp-template-edit',
  standalone: true,
  imports: [ReactiveFormsModule, TagListComponent, TemplateTaggingComponent],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private templatesService = inject(TemplatesService);
  private tagService = inject(TagService);

  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isNew = !this.id;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isAiBusy = signal(false);
  readonly isTranslationEnBusy = signal(false);
  readonly isTranslationPtBusy = signal(false);
  readonly isImprovingEnBusy = signal(false);
  readonly isImprovingPtBusy = signal(false);
  readonly tags = signal<Tag[]>([]);
  readonly availableTags = signal<Tag[]>([]);
  readonly selectedTagIds = signal<string[]>([]);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    bodyEn: [''],
    bodyPt: [''],
  });

  constructor() {
    this.tagService.getAll().subscribe({
      next: (tags) => {
        this.availableTags.set(tags);
      },
      error: () => {
        this.error.set('Failed to load tags.');
      },
    });

    if (this.isNew) {
      this.loading.set(false);
      return;
    }

    this.templatesService.getById(this.id!).subscribe({
      next: (t) => {
        this.form.reset({
          title: t.title ?? '',
          bodyEn: t.bodyEn ?? '',
          bodyPt: t.bodyPt ?? '',
        });

        const templateTags = t.tags ?? [];
        this.tags.set(templateTags);
        this.selectedTagIds.set(templateTags.map((tag) => tag.id));

        this.form.markAsPristine();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load template.');
        this.loading.set(false);
      },
    });
  }

  improveEn(): void {
    this.improveField('en');
  }
  improvePt(): void {
    this.improveField('pt');
  }

  translateEn(): void {
    const source = this.form.controls.bodyEn.value;
    this.translateField(source, Language.en);
  }

  translatePt(): void {
    const source = this.form.controls.bodyEn.value;
    this.translateField(source, Language.pt);
  }

  translateField(sourceText: string, language: Language): void {
    const targetControl = language === Language.en ? this.form.controls.bodyPt : this.form.controls.bodyEn;
    const busy = language === Language.en ? this.isTranslationEnBusy : this.isTranslationPtBusy;

    const text = sourceText ?? '';
    if (!text.trim()) return;

    this.isAiBusy.set(true);
    busy.set(true);
    this.templatesService.translateText(text).subscribe({
      next: (aiResponse) => {
        targetControl.setValue( aiResponse.response ?? '');
        targetControl.markAsDirty();
      },
      error: (err) => {
        console.error('Translate failed', err);
        this.error.set('AI translate failed.');
      },
      complete: () => {
        this.isAiBusy.set(false);
        busy.set(false);
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading.set(true);

    if (this.isNew) {
      const body: Omit<MessageTemplate, 'id'> = this.form.getRawValue();
      this.templatesService.create(body).subscribe({
        next: (created) => {
          this.form.markAsPristine();
          this.router.navigate(['/templates', created.id]);
        },
        error: () => {
          this.error.set('Failed to create template.');
          this.loading.set(false);
        },
      });
    } else {
      const patch: Partial<MessageTemplate> = this.form.getRawValue();
      this.templatesService.update(this.id!, patch).subscribe({
        next: () => {
          this.form.markAsPristine();
          this.router.navigate(['/templates', this.id!]);
        },
        error: () => {
          this.error.set('Failed to save changes.');
          this.loading.set(false);
        },
      });
    }
  }

  cancel(): void {
    if (this.isNew) this.router.navigate(['/templates']);
    else this.router.navigate(['/templates', this.id!]);
  }

  onTagIdsUpdated(tagIds: string[]): void {
    this.selectedTagIds.set(tagIds);
    const updatedTags = this.availableTags().filter((tag) => tagIds.includes(tag.id));
    this.tags.set(updatedTags);
  }

  private improveField(lang: 'en' | 'pt'): void {
    const control = lang === 'en' ? this.form.controls.bodyEn : this.form.controls.bodyPt;
    const busy = lang === 'en' ? this.isImprovingEnBusy : this.isImprovingPtBusy;

    const text = control.value ?? '';
    if (!text.trim()) return;

    this.isAiBusy.set(true);
    busy.set(true);
    this.templatesService.improveText(text).subscribe({
      next: (aiResponse) => {
        control.setValue(aiResponse.response ?? '');
        control.markAsDirty();
      },
      error: (err) => {
        console.error('Improve failed', err);
        this.error.set('AI improve failed.');
      },
      complete: () => {
        this.isAiBusy.set(false);
        busy.set(false);
      },
    });
  }
}
