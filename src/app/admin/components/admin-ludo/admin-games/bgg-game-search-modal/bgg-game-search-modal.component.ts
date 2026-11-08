import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Thing} from '../../../../../models/boardGame.model';

@Component({
    selector: 'app-bgg-game-search-modal',
    templateUrl: './bgg-game-search-modal.component.html',
    styleUrls: ['./bgg-game-search-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BggGameSearchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<BggGameSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      games: Array<Thing>
    }
  ) {
  }

  close() {
    this.dialogRef.close();
  }
}
