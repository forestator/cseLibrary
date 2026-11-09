import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

export interface ConfirmationData {
  confirmText: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatIcon],
})
export class ConfirmationModal {
  protected readonly data = inject<ConfirmationData>(MAT_DIALOG_DATA);
  protected readonly title = this.data.title ?? 'Confirmation';
  protected readonly confirmLabel = this.data.confirmLabel ?? 'Confirmer';
  protected readonly cancelLabel = this.data.cancelLabel ?? 'Annuler';
}
