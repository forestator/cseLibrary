import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {FilterBoardGamesService} from '../../../../services/filter-board-games.service';
import {BoardGameInfosPipe} from '../../../../pipes/board-game-infos.pipe';
import {GameRowComponent} from '../../../game-row/game-row.component';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrl: './board-game-category-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameRowComponent, BoardGameInfosPipe],
})
export class BoardGameCategoryDetailsComponent {
  private readonly filterService = inject(FilterBoardGamesService);

  readonly boardGames = input<ReadonlyArray<BoardGame>>();
  readonly selectedId = input<string>();

  protected readonly filteredBoardGames = computed(() => {
    const filter = this.filterService.filter();
    return this.boardGames()?.filter(boardGame => this.filterService.matches(boardGame, filter));
  });
}
