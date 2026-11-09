import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {switchMap} from 'rxjs';
import {LibraryId} from '../../../models/common.model';
import {ToolsService} from '../../../services/biblio/tools.service';
import {GamesRepository} from '../../services/games.repository';

/** Landing page of a library (board games, video games): its categories, each linking to the games list. */
@Component({
  selector: 'app-library-categories',
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class LibraryCategoriesComponent {
  /** Provided by the route `data`. */
  readonly libraryId = input.required<LibraryId>();

  private readonly repository = inject(GamesRepository);

  protected readonly mobilePhoneDisplay = toSignal(inject(ToolsService).mobilePhoneDisplay$, {requireSync: true});
  protected readonly library = toSignal(
    toObservable(this.libraryId).pipe(switchMap(libraryId => this.repository.loadLibrary$(libraryId)))
  );
  protected readonly categories = computed(() => this.library()?.categories ?? []);
}
