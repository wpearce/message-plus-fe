import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Tag } from '../../core/models/message-template';
import { TemplateTaggingComponent } from './template-tagging.component';

export type TemplateFirstSaveTagsDialogData = {
  templateId: string;
  tags: Tag[];
};

@Component({
  standalone: true,
  imports: [MatDialogModule, TemplateTaggingComponent],
  template: `
    <h2 mat-dialog-title>Add tags</h2>

    <div mat-dialog-content>
      <p class="message">Would you like to add tags now?</p>
      <mp-template-tagging
        [templateId]="data.templateId"
        [availableTags]="data.tags"
        [selectedTagIds]="selectedTagIds()"
        (tagIdsUpdated)="onTagIdsUpdated($event)"
      ></mp-template-tagging>
    </div>

    <div mat-dialog-actions align="end">
      <button type="button" class="btn" (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .message {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    .btn {
      appearance: none;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low);
      color: var(--mat-sys-on-surface);
      padding: 6px 12px;
      border-radius: 12px;
      cursor: pointer;
    }
  `],
})
export class TemplateFirstSaveTagsDialogComponent {
  readonly selectedTagIds = signal<string[]>([]);

  constructor(
    private readonly ref: MatDialogRef<TemplateFirstSaveTagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: TemplateFirstSaveTagsDialogData
  ) {}

  onTagIdsUpdated(tagIds: string[]): void {
    this.selectedTagIds.set(tagIds);
  }

  close(): void {
    this.ref.close();
  }
}
