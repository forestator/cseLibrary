import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {FilterBoardGamesComponent} from '../filter-board-games/filter-board-games.component';

export const FILTERS_SHEET_ID = 'board-game-filters';

/** Bottom sheet reusing the drawer filters; the overlay sits outside the shell, hence the accent scope. */
@Component({
  selector: 'app-filters-sheet',
  templateUrl: './filters-sheet.html',
  styleUrl: './filters-sheet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterBoardGamesComponent],
  host: {'data-commission': 'ludotheque', '[id]': 'sheetId'},
})
export class FiltersSheet {
  protected readonly sheetId = FILTERS_SHEET_ID;
  private readonly sheetRef = inject(MatBottomSheetRef<FiltersSheet>);

  protected close(): void {
    this.sheetRef.dismiss();
  }
}
