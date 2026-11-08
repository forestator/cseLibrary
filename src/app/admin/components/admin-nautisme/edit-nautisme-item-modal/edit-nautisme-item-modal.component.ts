import {Component, Inject} from '@angular/core';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import {AddNautismeItemModalComponent} from '../add-nautisme-item-modal/add-nautisme-item-modal.component';

@Component({
    selector: 'app-edit-nautisme-item-modal',
    templateUrl: './edit-nautisme-item-modal.component.html',
    styleUrls: ['./edit-nautisme-item-modal.component.scss'],
    standalone: false
})
export class EditNautismeItemModalComponent {
  filteredOptions$: Observable<Array<NautismeItem>>;
  searchText: FormControl<string>;

  constructor(
    public dialogRef: MatDialogRef<EditNautismeItemModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      items: Array<NautismeItem>
    },
  ) {
    this.searchText = new FormControl('');
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map((value) => this._filter(value || '', this.data.items)),
    );
  }

  private _filter(value: string | NautismeItem, userList: Array<NautismeItem>): Array<NautismeItem> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return userList.filter((item) => item.name.toLowerCase().includes(filterValue));
  }

  selectItemToModify($event: MatAutocompleteSelectedEvent) {
    this.dialog.open(AddNautismeItemModalComponent, {
      data: {items: this.data.items, selectedItem: $event.option.value}
    });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
