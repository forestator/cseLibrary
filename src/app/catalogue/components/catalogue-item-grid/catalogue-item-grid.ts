import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {CatalogueItem} from '../../models/catalogue-item.model';
import {CommissionConfig} from '../../models/commission-config.model';
import {CatalogueItemCard} from '../catalogue-item-card/catalogue-item-card';

const SKELETON_COUNT = [1, 2, 3, 4, 5, 6];

@Component({
  selector: 'app-catalogue-item-grid',
  templateUrl: './catalogue-item-grid.html',
  styleUrl: './catalogue-item-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogueItemCard, MatIcon],
})
export class CatalogueItemGrid {
  /** Undefined while the items are loading. */
  readonly items = input<CatalogueItem[]>();
  readonly config = input.required<CommissionConfig>();
  readonly selectedId = input<string>();

  protected readonly placeholders = SKELETON_COUNT;
}
