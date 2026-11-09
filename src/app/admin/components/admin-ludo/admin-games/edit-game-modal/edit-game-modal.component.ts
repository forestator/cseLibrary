import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {Game} from '../../../../../models/common.model';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import {map, Observable} from 'rxjs';
import {AddGameModalComponent} from '../add-game-modal/add-game-modal.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { BadgeComponent } from '../../../../../common/components/book-badge/badge.component';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-edit-game-modal',
    templateUrl: './edit-game-modal.component.html',
    styleUrls: ['./edit-game-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, BadgeComponent, MatDialogActions, MatButton, AsyncPipe]
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
