import {Component, Inject} from '@angular/core';
import {BoardGame, BoardGameStatus} from '../../../models/boardGame.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-change-borrow-status',
  templateUrl: './change-borrow-status.component.html',
  styleUrls: ['./change-borrow-status.component.scss']
})
export class ChangeBorrowStatusComponent {
  employee?: string;

  statusOptions: Array<string>;
  newStatus: BoardGameStatus;
  constructor(
    public dialogRef: MatDialogRef<ChangeBorrowStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardGame: BoardGame },
  ) {
    this.statusOptions = Object.values(BoardGameStatus);
    this.newStatus = this.data.boardGame.status === BoardGameStatus.AVAILABLE ?
      BoardGameStatus.EMPRUNTE : BoardGameStatus.AVAILABLE;
  }

  cancel(): void {
    this.dialogRef.close();
  }}
