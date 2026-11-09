import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {map, Observable} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import {NautismeItem} from '../../../../nautisme/models/nautisme.model';
import {AddNautismeItemModalComponent} from '../add-nautisme-item-modal/add-nautisme-item-modal.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-edit-nautisme-item-modal',
    templateUrl: './edit-nautisme-item-modal.component.html',
    styleUrls: ['./edit-nautisme-item-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatDialogActions, MatButton, AsyncPipe]
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
