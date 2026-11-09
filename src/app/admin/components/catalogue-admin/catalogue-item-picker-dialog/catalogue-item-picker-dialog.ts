import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {CatalogueItem} from '../../../../catalogue/models/catalogue-item.model';
import {CommissionConfig} from '../../../../catalogue/models/commission-config.model';
import {CatalogueItemDialog} from '../catalogue-item-dialog/catalogue-item-dialog';

export interface CataloguePickerData {
  config: CommissionConfig;
  items: CatalogueItem[];
}

function describeItem(item: CatalogueItem): string {
  return item.categoryId ? `${item.name} (${item.categoryId})` : item.name;
}

@Component({
  selector: 'app-catalogue-item-picker-dialog',
  templateUrl: './catalogue-item-picker-dialog.html',
  styleUrl: './catalogue-item-picker-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule,
    MatAutocompleteTrigger, MatAutocomplete, MatOption, MatDialogActions, MatButton],
})
export class CatalogueItemPickerDialog {
  private readonly dialogRef = inject<MatDialogRef<CatalogueItemPickerDialog>>(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  protected readonly data = inject<CataloguePickerData>(MAT_DIALOG_DATA);

  protected readonly texts = this.data.config.admin.texts;
  protected readonly searchText = new FormControl<string | CatalogueItem>('', {nonNullable: true});
  private readonly searchValue = toSignal(this.searchText.valueChanges, {initialValue: ''});

  protected readonly options = computed(() => {
    const value = this.searchValue();
    const filterValue = (typeof value === 'string' ? value : value.name).toLowerCase();
    return this.data.items
      .filter(item => item.name.toLowerCase().includes(filterValue) || item.id.toLowerCase().includes(filterValue))
      .map(item => ({item, label: describeItem(item)}));
  });

  protected readonly displayItem = (item?: CatalogueItem | string): string =>
    typeof item === 'string' ? item : (item ? describeItem(item) : '');

  protected selectItem(event: MatAutocompleteSelectedEvent) {
    this.dialog.open(CatalogueItemDialog, {
      data: {config: this.data.config, items: this.data.items, selectedItem: event.option.value}
    });
    this.cancel();
  }

  protected cancel() {
    this.dialogRef.close();
  }
}
