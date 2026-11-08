import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import {AddToolModalComponent} from "../add-tool-modal/add-tool-modal.component";

@Component({
    selector: 'app-edit-tool-modal',
    templateUrl: './edit-tool-modal.component.html',
    styleUrls: ['./edit-tool-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditToolModalComponent {

  filteredOptions$: Observable<Array<Tool>>;
  searchText: FormControl<string>;
  constructor(
    public dialogRef: MatDialogRef<EditToolModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      tools: Array<Tool>
    },
  ) {
    this.searchText = new FormControl('');
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map((value) => this._filter(value || '', this.data.tools)),
    );
  }
  private _filter(value: string | Tool, userList: Array<Tool>): Array<Tool> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return userList.filter((item) => item.name.toLowerCase().includes(filterValue) || item.id.toString().includes(filterValue));
  }

  displayTool(option?: Tool) {
    if (option) {
      return option.name;
    } else {
      return '';
    }
  }

  selectToolToModify($event: MatAutocompleteSelectedEvent) {
    this.dialog.open(AddToolModalComponent, {
      data: {tools: this.data.tools, selectedTool: $event.option.value}
    });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
