import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/autocomplete';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {firstValueFrom, map, startWith, switchMap} from 'rxjs';
import {BadgeComponent} from '../../../../../common/components/book-badge/badge.component';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {BoardGameCategory, Thing} from '../../../../../models/boardGame.model';
import {Game, LibraryId} from '../../../../../models/common.model';
import {Consoles, VideoGameType} from '../../../../../models/videoGames.model';
import {BggGameSearchModalComponent} from '../bgg-game-search-modal/bgg-game-search-modal.component';
import {UploadGameComponent} from '../upload-game/upload-game.component';

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-game-form',
  templateUrl: './add-game-form.component.html',
  styleUrl: './add-game-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonToggleGroup, MatButtonToggle, MatFormField, MatLabel, MatInput, MatIcon,
    MatSelect, MatOption, BadgeComponent, MatCheckbox, MatDivider, UploadGameComponent],
})
export class AddGameFormComponent {
  private readonly bggService = inject(BGGService);
  private readonly dialog = inject(MatDialog);

  readonly gameForm = input.required<FormGroup>();
  readonly gameSelected = output<void>();

  private readonly libraryIdChanges$ = toObservable(this.gameForm).pipe(
    switchMap(form => form.controls['libraryId'].valueChanges.pipe(startWith(form.controls['libraryId'].value)))
  );
  protected readonly libraryId = toSignal(this.libraryIdChanges$, {initialValue: 'boardGames' as LibraryId});

  /** Snapshot of the form value, as the upload component reads the game being edited. */
  protected readonly game = toSignal(
    toObservable(this.gameForm).pipe(
      switchMap(form => form.valueChanges.pipe(startWith(form.value), map(() => form.value as Game)))
    )
  );

  protected readonly categoryOptions = computed<Array<CategoryOption>>(() => {
    switch (this.libraryId()) {
      case 'videoGames':
        return Object.values(Consoles).map(console => ({id: console, name: console}));
      case 'outsideGames':
        return [{id: 'outsideGames', name: 'Jeu plein air'}];
      default:
        return Object.values(BoardGameCategory).map(category => ({id: category, name: category}));
    }
  });

  constructor() {
    effect(() => {
      if (this.libraryId() === 'videoGames') {
        this.gameForm().addControl('type', new FormControl(VideoGameType.GAME));
      }
    });
  }

  protected async search(): Promise<void> {
    const name = this.gameForm().get('name').value;
    if (!name) {
      return;
    }
    const games = await firstValueFrom(this.bggService.searchGame(name));
    const thing: Thing | undefined = await firstValueFrom(
      this.dialog.open(BggGameSearchModalComponent, {data: {games}}).afterClosed()
    );
    if (thing) {
      this.gameForm().get('id').setValue(thing.attributes?.id);
      this.gameSelected.emit();
    }
  }
}
