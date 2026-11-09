import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButton, MatIcon],
})
export class DeleteModalComponent {
  private readonly dialogRef = inject<MatDialogRef<DeleteModalComponent, boolean>>(MatDialogRef);
  protected readonly data = inject<{message: string}>(MAT_DIALOG_DATA);

  protected close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}
