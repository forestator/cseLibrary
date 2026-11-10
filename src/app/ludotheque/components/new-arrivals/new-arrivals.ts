import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {combineLatest, map} from 'rxjs';
import {Game, LibraryId} from '../../../models/common.model';
import {categoryLabel} from '../../pipes/game-category-label.pipe';
import {GamesRepository} from '../../services/games.repository';

interface Arrival {
  ref: string;
  name: string;
  cover?: string;
  label: string;
  link: string;
}

// Each library gets its share so the strip mixes board games, video games and big games.
const MAX_PER_LIBRARY = {boardGames: 8, videoGames: 5, outsideGames: 3} as const;

/** Highlighted strip of the latest additions of the ludotheque, shown on top of its landing page. */
@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.html',
  styleUrl: './new-arrivals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, NgOptimizedImage, RouterLink],
})
export class NewArrivals {
  private readonly repository = inject(GamesRepository);

  private readonly arrivals = toSignal(
    combineLatest(
      (['boardGames', 'videoGames', 'outsideGames'] as const).map(libraryId =>
        this.repository.loadGames$(libraryId).pipe(
          map(games => games.filter(game => game.isNew).map(game => this.toArrival(libraryId, game)))
        )
      )
    )
  );

  protected readonly count = computed(() => this.arrivals()?.reduce((total, arrivals) => total + arrivals.length, 0));
  protected readonly shown = computed(() => this.arrivals()?.flatMap((arrivals, index) =>
    arrivals.slice(0, Object.values(MAX_PER_LIBRARY)[index])));
  protected readonly placeholders = [1, 2, 3, 4, 5];

  private toArrival(libraryId: LibraryId, game: Game & {id?: string}): Arrival {
    const base = `/ludotheque/${libraryId}`;
    const link = libraryId === 'outsideGames'
      ? `${base}/${game.ref}`
      : `${base}/${game.category}/${libraryId === 'boardGames' ? (game.id ?? game.ref) : game.ref}`;
    return {
      ref: game.ref,
      name: game.name,
      cover: game.cover,
      label: libraryId === 'outsideGames' ? 'Grand jeu' : categoryLabel(game.category),
      link,
    };
  }
}
