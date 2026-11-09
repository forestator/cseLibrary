import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {map, Observable} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import {Tool} from '../../../../bricolage/models/bricolage.model';
import {AddToolModalComponent} from "../add-tool-modal/add-tool-modal.component";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-edit-tool-modal',
    templateUrl: './edit-tool-modal.component.html',
    styleUrls: ['./edit-tool-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatDialogActions, MatButton, AsyncPipe]
})
export class EditToolModalComponent {
  dialogRef = inject<MatDialogRef<EditToolModalComponent>>(MatDialogRef);
  private dialog = inject(MatDialog);
  data = inject<{
    tools: Array<Tool>;
}>(MAT_DIALOG_DATA);


  filteredOptions$: Observable<Array<Tool>>;
  searchText: FormControl<string>;
  constructor() {
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
