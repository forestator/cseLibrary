import {Component, Inject} from '@angular/core';
import {map, Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AddSonoItemModalComponent} from "../add-sono-item-modal/add-sono-item-modal.component";
import {SonoItem} from "../../../../sonotheque/models/sono.model";

@Component({
  selector: 'app-edit-sono-item-modal',
  templateUrl: './edit-sono-item-modal.component.html',
  styleUrls: ['./edit-sono-item-modal.component.scss']
})
export class EditSonoItemModalComponent {
  filteredOptions$: Observable<Array<SonoItem>>;
  searchText: FormControl<string>;

  constructor(
    public dialogRef: MatDialogRef<EditSonoItemModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      items: Array<SonoItem>
    },
  ) {
    this.searchText = new FormControl('');
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map((value) => this._filter(value || '', this.data.items)),
    );
  }

  private _filter(value: string | SonoItem, userList: Array<SonoItem>): Array<SonoItem> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return userList.filter((item) => item.name.toLowerCase().includes(filterValue));
  }

  displaySonoItem(option?: SonoItem) {
    if (option?.category) {
      return `${option.name} (${option.category})`;
    } else if (option) {
      return `${option.name}`;
    } else {
      return '';
    }
  }

  selectItemToModify($event: MatAutocompleteSelectedEvent) {
    this.dialog.open(AddSonoItemModalComponent, {
      data: {items: this.data.items, selectedItem: $event.option.value}
    });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
