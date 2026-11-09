import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatIcon} from '@angular/material/icon';
import {BoardGame} from '../../../models/boardGame.model';
import {Game, LibraryId} from '../../../models/common.model';
import {NavigationService} from '../../../services/navigation.service';
import {GameCategoryLabelPipe} from '../../pipes/game-category-label.pipe';
import {GamesRepository} from '../../services/games.repository';

@Component({
  selector: 'app-search-in-lib',
  templateUrl: './search-in-lib.component.html',
  styleUrl: './search-in-lib.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, GameCategoryLabelPipe],
})
export class SearchInLibComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly repository = inject(GamesRepository);

  protected readonly searchText = new FormControl<string | Game>('');

  private readonly boardGames = toSignal(this.repository.loadGames$('boardGames'), {initialValue: []});
  private readonly videoGames = toSignal(this.repository.loadGames$('videoGames'), {initialValue: []});
  private readonly outsideGames = toSignal(this.repository.loadGames$('outsideGames'), {initialValue: []});
  private readonly url = toSignal(this.navigationService.url$, {requireSync: true});
  private readonly searchValue = toSignal(this.searchText.valueChanges, {initialValue: ''});

  /** Searches in the library of the current page, or in all of them elsewhere. */
  private readonly gamesToSearchIn = computed<ReadonlyArray<Game>>(() => {
    const url = this.url();
    const libraryId: LibraryId | undefined = (['boardGames', 'videoGames', 'outsideGames'] as const)
      .find(id => url.includes(id));
    switch (libraryId) {
      case 'boardGames':
        return this.boardGames();
      case 'videoGames':
        return this.videoGames();
      case 'outsideGames':
        return this.outsideGames();
      default:
        return [...this.boardGames(), ...this.videoGames(), ...this.outsideGames()];
    }
  });

  protected readonly hasText = computed(() => !!this.searchValue());

  protected readonly filteredOptions = computed(() => {
    const value = this.searchValue();
    const filterValue = (typeof value === 'string' ? value : value?.name ?? '').toLowerCase();
    return this.gamesToSearchIn().filter(game => game.name?.toLowerCase().includes(filterValue));
  });

  protected readonly displayGame = (game?: Game): string => game ? `${game.name}` : '';

  protected clear(): void {
    this.searchText.setValue('');
  }

  protected goToSelectedItem(event: MatAutocompleteSelectedEvent): void {
    this.navigationService.goToGame(event.option.value as BoardGame);
  }
}
