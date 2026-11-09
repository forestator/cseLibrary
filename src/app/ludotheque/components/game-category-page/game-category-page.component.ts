import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';
import {Game} from '../../../models/common.model';
import {VideoGame} from '../../../models/videoGames.model';
import {GamesRepository} from '../../services/games.repository';
import {BoardGameCategoryDetailsComponent} from '../board-games/components/board-game-category-details/board-game-category-details.component';
import {VideoGamesConsoleDetailsComponent} from '../video-games/video-games-console-details/video-games-console-details.component';

/** Games of one category (board game category or console); routes `.../:categoryId[/:id]`, `id` being the game to scroll to. */
@Component({
  selector: 'app-game-category-page',
  templateUrl: './game-category-page.component.html',
  styleUrl: './game-category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardGameCategoryDetailsComponent, VideoGamesConsoleDetailsComponent],
})
export class GameCategoryPageComponent {
  /** Provided by the route `data`. */
  readonly libraryId = input.required<'boardGames' | 'videoGames'>();
  readonly categoryId = input.required<string>();
  readonly id = input<string>();

  private readonly repository = inject(GamesRepository);

  private readonly libraryGames = toSignal(
    toObservable(this.libraryId).pipe(switchMap(libraryId => this.repository.watchGames$<'boardGames' | 'videoGames'>(libraryId)))
  );
  private readonly categoryGames = computed<ReadonlyArray<Game> | undefined>(() =>
    this.libraryGames()?.filter(game => game.category === this.categoryId()));

  protected readonly boardGames = computed(() =>
    this.libraryId() === 'boardGames' ? this.categoryGames() as ReadonlyArray<BoardGame> : undefined);
  protected readonly videoGames = computed(() =>
    this.libraryId() === 'videoGames' ? this.categoryGames() as ReadonlyArray<VideoGame> : undefined);
}
