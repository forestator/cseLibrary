import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatIcon} from '@angular/material/icon';
import {FilterBoardGamesService} from '../../../../services/filter-board-games.service';
import {FILTERS_SHEET_ID, FiltersSheet} from './filters-sheet';

/** Phone-only entry point to the board game filters, which otherwise live in the navigation drawer. */
@Component({
  selector: 'app-filters-button',
  templateUrl: './filters-button.html',
  styleUrl: './filters-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FiltersButton {
  private readonly bottomSheet = inject(MatBottomSheet);

  protected readonly activeCount = inject(FilterBoardGamesService).activeCount;
  protected readonly sheetId = FILTERS_SHEET_ID;
  protected readonly open = signal(false);

  protected openFilters(): void {
    this.open.set(true);
    const sheet = this.bottomSheet.open(FiltersSheet, {ariaLabel: 'Filtres des jeux de société'});
    sheet.afterDismissed().subscribe(() => this.open.set(false));
  }
}
