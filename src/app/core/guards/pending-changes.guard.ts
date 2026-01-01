import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import {TemplateEditComponent} from '../../features/templates/template-edit.component';
import {ConfirmDiscardDialogComponent} from '../../features/templates/confirm-discard-dialog.component';

export const pendingChangesGuard: CanDeactivateFn<TemplateEditComponent> = (component) => {
  if (!component.form.dirty) return true;

  const dialog = inject(MatDialog);

  return dialog
    .open(ConfirmDiscardDialogComponent, {
      disableClose: true,
      data: {
        title: 'Discard changes?',
        message: 'You have unsaved changes. Do you want to discard them and leave?',
        confirmText: 'Discard',
        cancelText: 'Cancel',
      },
    })
    .afterClosed()
    .pipe(map((discard) => discard === true));
};
