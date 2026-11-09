import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
  dialogRef = inject<MatDialogRef<BggGameSearchModalComponent>>(MatDialogRef);
  data = inject<{
    games: Array<Thing>;
}>(MAT_DIALOG_DATA);


  close() {
    this.dialogRef.close();
  }
}
