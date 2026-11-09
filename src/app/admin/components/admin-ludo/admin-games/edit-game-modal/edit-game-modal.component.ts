import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel, MatPrefix} from '@angular/material/input';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {BadgeComponent} from '../../../../../common/components/book-badge/badge.component';
import {Game} from '../../../../../models/common.model';
import {ADMIN_DIALOG_CONFIG} from '../../../../admin-dialog.config';
import {AddGameModalComponent} from '../add-game-modal/add-game-modal.component';

@Component({
  selector: 'app-edit-game-modal',
  templateUrl: './edit-game-modal.component.html',
  styleUrl: './edit-game-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule,
    MatAutocompleteTrigger, MatAutocomplete, MatOption, BadgeComponent, MatDialogActions, MatButton, MatIcon, MatPrefix],
})
export class EditGameModalComponent {
  private readonly dialogRef = inject<MatDialogRef<EditGameModalComponent>>(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  private readonly data = inject<{ games: Array<Game> }>(MAT_DIALOG_DATA);

  protected readonly searchText = new FormControl<string | Game>('');
  private readonly searchValue = toSignal(this.searchText.valueChanges, {initialValue: ''});

  protected readonly filteredOptions = computed(() => {
    const value = this.searchValue();
    const filterValue = (typeof value === 'string' ? value : value?.name ?? '').toLowerCase();
    return this.data.games.filter(game => game.name.toLowerCase().includes(filterValue));
  });

  protected readonly displayGame = (game: Game): string => game.name;

  protected selectGameToModify(event: MatAutocompleteSelectedEvent): void {
    this.dialog.open(AddGameModalComponent, {
      ...ADMIN_DIALOG_CONFIG,
      data: {games: this.data.games, selectedGame: event.option.value}
    });
    this.cancel();
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
