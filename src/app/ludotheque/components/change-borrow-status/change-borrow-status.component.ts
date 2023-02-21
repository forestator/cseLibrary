import {Component, Inject} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LudoStatus} from '../../../models/common.model';

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status.component.html',
  styleUrls: ['./change-borrow-status.component.scss']
})
export class ChangeBorrowStatusComponent {
  employee?: string;
  statusOptions: Array<string>;
  newStatus: LudoStatus;
  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardGame: BoardGame },
  ) {
    this.statusOptions = Object.values(LudoStatus);
    this.newStatus = this.data.boardGame.status === LudoStatus.AVAILABLE ?
      LudoStatus.EMPRUNTE : LudoStatus.AVAILABLE;
  }

  cancel(): void {
    this.dialogRef.close();
  }}
