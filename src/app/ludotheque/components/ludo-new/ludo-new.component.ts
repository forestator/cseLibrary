import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {LibraryId} from '../../../models/common.model';
import {GamesRepository, GameOf} from '../../services/games.repository';
import {BoardGameCategoryDetailsComponent} from '../board-games/components/board-game-category-details/board-game-category-details.component';
import {VideoGamesConsoleDetailsComponent} from '../video-games/video-games-console-details/video-games-console-details.component';
import {GameRowComponent} from '../game-row/game-row.component';

@Component({
  selector: 'app-ludo-new',
  templateUrl: './ludo-new.component.html',
  styleUrl: './ludo-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardGameCategoryDetailsComponent, VideoGamesConsoleDetailsComponent, GameRowComponent],
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
