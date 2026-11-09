import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {BoardGame} from '../../../../../models/boardGame.model';
import {BoardGameInfosPipe} from '../../../../pipes/board-game-infos.pipe';
import {GameCardComponent} from '../../../shared/game-card/game-card.component';
import {GameGridComponent} from '../../../shared/game-grid/game-grid.component';

/** Grid of board game cards; `undefined` means the games are still loading. */
@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrl: './board-game-category-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameCardComponent, GameGridComponent, BoardGameInfosPipe],
})
export class BoardGameCategoryDetailsComponent {
  readonly boardGames = input<ReadonlyArray<BoardGame>>();
  readonly selectedId = input<string>();
  readonly showCategory = input(true);
  readonly emptyMessage = input('Aucun jeu ne correspond à votre recherche.');
}
