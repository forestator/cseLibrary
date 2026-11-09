import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Thing} from '../../../../../models/boardGame.model';

@Component({
  selector: 'app-bgg-game-search-modal',
  templateUrl: './bgg-game-search-modal.component.html',
  styleUrl: './bgg-game-search-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatSelectionList, MatListOption, MatDialogActions,
    MatButton, MatDialogClose],
})
export class BggGameSearchModalComponent {
  private readonly dialogRef = inject<MatDialogRef<BggGameSearchModalComponent>>(MatDialogRef);
  protected readonly data = inject<{ games: Array<Thing> }>(MAT_DIALOG_DATA);

  protected readonly selectedGame = signal<Thing | undefined>(undefined);

  protected select(change: MatSelectionListChange): void {
    this.selectedGame.set(change.source.selectedOptions.selected[0]?.value);
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
