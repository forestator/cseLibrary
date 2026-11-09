import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {LibraryId} from '../../../models/common.model';
import {GamesRepository, GameOf} from '../../services/games.repository';
import {BoardGameCategoryDetailsComponent} from '../board-games/components/board-game-category-details/board-game-category-details.component';
import {GameCardComponent} from '../shared/game-card/game-card.component';
import {GameGridComponent} from '../shared/game-grid/game-grid.component';
import {PageHeaderComponent} from '../shared/page-header/page-header.component';
import {SectionTitleComponent} from '../shared/section-title/section-title.component';

@Component({
  selector: 'app-ludo-new',
  templateUrl: './ludo-new.component.html',
  styleUrl: './ludo-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BoardGameCategoryDetailsComponent, GameCardComponent, GameGridComponent,
    PageHeaderComponent, SectionTitleComponent,
  ],
})
export class LudoNewComponent {
  private readonly repository = inject(GamesRepository);

  protected readonly boardGames = toSignal(this.newGames$('boardGames'));
  protected readonly videoGames = toSignal(this.newGames$('videoGames'));
  protected readonly outsideGames = toSignal(this.newGames$('outsideGames'));

  private newGames$<Id extends LibraryId>(libraryId: Id) {
    return this.repository.loadGames$(libraryId).pipe(
      map((games: Array<GameOf<Id>>) => games.filter(game => game.isNew))
    );
  }
}
