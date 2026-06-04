import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import { TagService } from '../../core/services/tag.service';
import { TemplatesService } from '../../core/services/template.service';
import { TemplateEditComponent } from './template-edit.component';
import { TemplateFirstSaveTagsDialogComponent } from './template-first-save-tags-dialog.component';

describe('TemplateEditComponent', () => {
  const availableTags = [{ id: 'tag-1', name: 'Important' }];
  const createdTemplate = {
    id: 'template-1',
    title: 'Welcome',
    bodyEn: '',
    bodyPt: '',
  };

  let templatesService: {
    create: Mock;
    getById: Mock;
    improveText: Mock;
    linkTag: Mock;
    translateText: Mock;
    unlinkTag: Mock;
    update: Mock;
  };
  let tagService: { getAll: Mock };
  let router: { navigate: Mock };
  let dialog: { open: Mock };

  beforeEach(async () => {
    templatesService = {
      create: vi.fn(),
      getById: vi.fn(),
      improveText: vi.fn(),
      linkTag: vi.fn(),
      translateText: vi.fn(),
      unlinkTag: vi.fn(),
      update: vi.fn(),
    };
    tagService = { getAll: vi.fn() };
    router = { navigate: vi.fn() };
    dialog = { open: vi.fn() };

    tagService.getAll.mockReturnValue(of(availableTags));
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    await TestBed.configureTestingModule({
      imports: [TemplateEditComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
        { provide: TagService, useValue: tagService },
        { provide: TemplatesService, useValue: templatesService },
      ],
    }).compileComponents();
  });

  it('creates a new template and opens the first-save tags dialog', async () => {
    templatesService.create.mockReturnValue(of(createdTemplate));
    const fixture = await createComponent();

    await enterTitleAndSave(fixture, 'Welcome');

    expect(templatesService.create).toHaveBeenCalledWith({
      title: 'Welcome',
      bodyEn: '',
      bodyPt: '',
    });
    expect(dialog.open).toHaveBeenCalledWith(TemplateFirstSaveTagsDialogComponent, {
      data: {
        templateId: 'template-1',
        tags: availableTags,
      },
      width: '700px',
      maxWidth: '95vw',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/templates']);
  });

  it('shows an error message when creating a new template fails', async () => {
    templatesService.create.mockReturnValue(throwError(() => new Error('Request failed')));
    const fixture = await createComponent();

    await enterTitleAndSave(fixture, 'Welcome');

    expect(dialog.open).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).querySelector('.err')?.textContent).toContain(
      'Failed to create template.'
    );
  });

  async function createComponent(): Promise<ComponentFixture<TemplateEditComponent>> {
    const fixture = TestBed.createComponent(TemplateEditComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    return fixture;
  }

  async function enterTitleAndSave(
    fixture: ComponentFixture<TemplateEditComponent>,
    title: string
  ): Promise<void> {
    const element = fixture.nativeElement as HTMLElement;
    const titleInput = element.querySelector<HTMLInputElement>('input[formControlName="title"]')!;
    titleInput.value = title;
    titleInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const saveButton = element.querySelector<HTMLButtonElement>('button.primary')!;
    saveButton.click();
    await fixture.whenStable();
  }
});
