import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Game} from '../../../../../models/common.model';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, Observable} from 'rxjs';
import {AddGameModalComponent} from '../add-game-modal/add-game-modal.component';

@Component({
    selector: 'app-edit-game-modal',
    templateUrl: './edit-game-modal.component.html',
    styleUrls: ['./edit-game-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditGameModalComponent {

  filteredOptions$: Observable<Array<Game>>;
  searchText: FormControl<string>;
  constructor(
    public dialogRef: MatDialogRef<EditGameModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      games: Array<Game>
    },
  ) {
    this.searchText = new FormControl('');
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map((value) => this._filter(value || '', this.data.games)),
    );
  }
  private _filter(value: string | Game, userList: Array<Game>): Array<Game> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return userList.filter((item) => item.name.toLowerCase().includes(filterValue));
  }

  displayGame(option: Game) {
    return option.name;
  }

  selectGameToModify($event: MatAutocompleteSelectedEvent) {
    this.dialog.open(AddGameModalComponent, {
      data: {games: this.data.games, selectedGame: $event.option.value}
    });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
