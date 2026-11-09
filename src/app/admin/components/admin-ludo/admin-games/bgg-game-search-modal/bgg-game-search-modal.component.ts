import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import {Thing} from '../../../../../models/boardGame.model';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-bgg-game-search-modal',
    templateUrl: './bgg-game-search-modal.component.html',
    styleUrls: ['./bgg-game-search-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatSelectionList, MatListOption, MatDialogActions, MatButton, MatDialogClose]
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
