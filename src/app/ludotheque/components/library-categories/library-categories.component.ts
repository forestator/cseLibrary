import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {LibraryId} from '../../../models/common.model';
import {GamesRepository} from '../../services/games.repository';
import {GameGridComponent} from '../shared/game-grid/game-grid.component';
import {PageHeaderComponent} from '../shared/page-header/page-header.component';
import {TileCardComponent} from '../shared/tile-card/tile-card.component';

/** Landing page of a library (board games, video games): its categories, each linking to the games list. */
@Component({
  selector: 'app-library-categories',
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameGridComponent, PageHeaderComponent, TileCardComponent],
})
export class LibraryCategoriesComponent {
  /** Provided by the route `data`. */
  readonly libraryId = input.required<LibraryId>();

  private readonly repository = inject(GamesRepository);

  protected readonly library = toSignal(
    toObservable(this.libraryId).pipe(switchMap(libraryId => this.repository.loadLibrary$(libraryId)))
  );
  protected readonly categories = computed(() => this.library()?.categories ?? []);
  protected readonly categoryCount = computed(() => {
    const count = this.categories().length;
    return count ? `${count} catégorie${count > 1 ? 's' : ''}` : undefined;
  });
}
