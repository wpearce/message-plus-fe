import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type ConfirmDiscardDialogData = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">
        {{ data.cancelText }}
      </button>
      <button mat-button color="warn" (click)="close(true)">
        {{ data.confirmText }}
      </button>
    </div>
  `,
})
export class ConfirmDiscardDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDiscardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDiscardDialogData
  ) {}

  close(result: boolean) {
    this.ref.close(result);
  }
}
