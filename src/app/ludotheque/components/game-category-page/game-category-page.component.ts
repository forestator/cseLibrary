import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';
import {Game} from '../../../models/common.model';
import {VideoGame} from '../../../models/videoGames.model';
import {categoryLabel} from '../../pipes/game-category-label.pipe';
import {FilterBoardGamesService} from '../../services/filter-board-games.service';
import {GamesRepository} from '../../services/games.repository';
import {BoardGameCategoryDetailsComponent} from '../board-games/components/board-game-category-details/board-game-category-details.component';
import {FiltersButton} from '../board-games/components/filters-button/filters-button';
import {PageHeaderComponent} from '../shared/page-header/page-header.component';
import {VideoGamesConsoleDetailsComponent} from '../video-games/video-games-console-details/video-games-console-details.component';

/** Games of one category (board game category or console); routes `.../:categoryId[/:id]`, `id` being the game to scroll to. */
@Component({
  selector: 'app-game-category-page',
  templateUrl: './game-category-page.component.html',
  styleUrl: './game-category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardGameCategoryDetailsComponent, FiltersButton, VideoGamesConsoleDetailsComponent, PageHeaderComponent],
})
export class GameCategoryPageComponent {
  /** Provided by the route `data`. */
  readonly libraryId = input.required<'boardGames' | 'videoGames'>();
  readonly categoryId = input.required<string>();
  readonly id = input<string>();

  private readonly repository = inject(GamesRepository);
  private readonly filterService = inject(FilterBoardGamesService);

  private readonly library = toSignal(
    toObservable(this.libraryId).pipe(switchMap(libraryId => this.repository.loadLibrary$(libraryId)))
  );
  private readonly libraryGames = toSignal(
    toObservable(this.libraryId).pipe(switchMap(libraryId => this.repository.watchGames$<'boardGames' | 'videoGames'>(libraryId)))
  );
  private readonly categoryGames = computed<ReadonlyArray<Game> | undefined>(() =>
    this.libraryGames()?.filter(game => game.category === this.categoryId()));
  protected readonly category = computed(() => this.library()?.categories?.find(category => category.id === this.categoryId()));

  protected readonly boardGames = computed(() =>
    this.libraryId() === 'boardGames' ? this.categoryGames() as ReadonlyArray<BoardGame> : undefined);
  protected readonly filteredBoardGames = computed(() => {
    const filter = this.filterService.filter();
    return this.boardGames()?.filter(boardGame => this.filterService.matches(boardGame, filter));
  });
  protected readonly videoGames = computed(() =>
    this.libraryId() === 'videoGames' ? this.categoryGames() as ReadonlyArray<VideoGame> : undefined);

  protected readonly title = computed(() => this.category()?.name ?? categoryLabel(this.categoryId()));
  protected readonly parentLabel = computed(() => this.library()?.name ?? 'Retour');
  protected readonly parentLink = computed(() => `/ludotheque/${this.libraryId()}`);
  protected readonly count = computed(() => {
    const total = this.categoryGames()?.length;
    if (total === undefined) {
      return undefined;
    }
    const shown = this.libraryId() === 'boardGames' ? this.filteredBoardGames()?.length ?? total : total;
    const noun = this.libraryId() === 'boardGames' ? 'jeu' : 'article';
    const plural = total > 1 ? (noun === 'jeu' ? 'jeux' : 'articles') : noun;
    return shown === total ? `${total} ${plural}` : `${shown} sur ${total} ${plural}`;
  });
}
