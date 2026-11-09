import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {TitleCasePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {switchMap} from 'rxjs';
import {ItemCollection} from '../../../catalogue/models/catalogue-item.model';
import {CatalogueCommission} from '../../../catalogue/models/commission-config.model';
import {injectCatalogue} from '../../../catalogue/services/inject-catalogue';
import {ADMIN_DIALOG_CONFIG, ADMIN_PICKER_DIALOG_CONFIG} from '../../admin-dialog.config';
import {CataloguePageHeader} from '../../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../../catalogue/models/count-label';
import {CatalogueItemDialog, CatalogueItemDialogData} from './catalogue-item-dialog/catalogue-item-dialog';
import {CatalogueItemPickerDialog, CataloguePickerData} from './catalogue-item-picker-dialog/catalogue-item-picker-dialog';
import {CatalogueTable} from './catalogue-table/catalogue-table';

@Component({
  selector: 'app-catalogue-admin',
  templateUrl: './catalogue-admin.html',
  styleUrl: './catalogue-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
    MatExpansionPanelDescription, MatExpansionPanelContent, CatalogueTable, CataloguePageHeader, TitleCasePipe],
})
export class CatalogueAdmin {
  private readonly dialog = inject(MatDialog);

  // Bound from the route data.
  readonly commission = input.required<CatalogueCommission>();

  private readonly catalogue = injectCatalogue(this.commission);
  protected readonly config = this.catalogue.config;
  protected readonly texts = computed(() => this.config().admin.texts);

  private readonly collection = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.allItems$)),
    {initialValue: {} as ItemCollection});

  protected readonly items = computed(() => Object.values(this.collection()));
  protected readonly countLabel = computed(() => countLabel(this.items().length));
  protected readonly categories = computed(() => (this.config().categories ?? []).map(categoryId => {
    const items = this.items().filter(item => item.categoryId === categoryId);
    return {id: categoryId, items, countLabel: countLabel(items.length)};
  }));

  protected addItem() {
    const data: CatalogueItemDialogData = {config: this.config(), items: this.items()};
    this.dialog.open(CatalogueItemDialog, {data, ...ADMIN_DIALOG_CONFIG});
  }

  protected editItem() {
    const data: CataloguePickerData = {config: this.config(), items: this.items()};
    this.dialog.open(CatalogueItemPickerDialog, {data, ...ADMIN_PICKER_DIALOG_CONFIG});
  }
}
