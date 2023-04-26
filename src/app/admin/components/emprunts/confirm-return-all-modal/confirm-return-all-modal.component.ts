import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-return-all-modal',
  templateUrl: './confirm-return-all-modal.component.html',
  styleUrls: ['./confirm-return-all-modal.component.scss']
})
export class ConfirmReturnAllModalComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmReturnAllModalComponent>) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
