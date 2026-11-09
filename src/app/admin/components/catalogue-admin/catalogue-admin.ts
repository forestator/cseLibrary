import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {TitleCasePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatDivider} from '@angular/material/divider';
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader, MatExpansionPanelTitle
} from '@angular/material/expansion';
import {switchMap} from 'rxjs';
import {ItemCollection} from '../../../catalogue/models/catalogue-item.model';
import {CatalogueCommission} from '../../../catalogue/models/commission-config.model';
import {injectCatalogue} from '../../../catalogue/services/inject-catalogue';
import {CatalogueItemDialog, CatalogueItemDialogData} from './catalogue-item-dialog/catalogue-item-dialog';
import {CatalogueItemPickerDialog, CataloguePickerData} from './catalogue-item-picker-dialog/catalogue-item-picker-dialog';
import {CatalogueTable} from './catalogue-table/catalogue-table';

@Component({
  selector: 'app-catalogue-admin',
  templateUrl: './catalogue-admin.html',
  styleUrl: './catalogue-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatDivider, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
    MatExpansionPanelContent, CatalogueTable, TitleCasePipe],
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
  protected readonly categories = computed(() => (this.config().categories ?? []).map(categoryId => ({
    id: categoryId,
    items: this.items().filter(item => item.categoryId === categoryId),
  })));

  protected addItem() {
    const data: CatalogueItemDialogData = {config: this.config(), items: this.items()};
    this.dialog.open(CatalogueItemDialog, {data});
  }

  protected editItem() {
    const data: CataloguePickerData = {config: this.config(), items: this.items()};
    this.dialog.open(CatalogueItemPickerDialog, {data});
  }
}
