import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {BadgeComponent} from '../../../common/components/book-badge/badge.component';
import {CatalogueItem} from '../../models/catalogue-item.model';
import {CommissionConfig} from '../../models/commission-config.model';

interface ItemDetail {
  label: string;
  value: string;
}

let nextCardId = 0;

@Component({
  selector: 'app-catalogue-item-card',
  templateUrl: './catalogue-item-card.html',
  styleUrl: './catalogue-item-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, MatIcon, NgOptimizedImage],
  host: {class: 'catalogue-card', '[id]': 'item().id', '[class.catalogue-card-selected]': 'selected()',
    '[class.catalogue-card-open]': 'open()'},
})
export class CatalogueItemCard {
  readonly item = input.required<CatalogueItem>();
  readonly config = input.required<CommissionConfig>();
  readonly selected = input(false);
  /** Cards of the first row are loaded eagerly: they are the largest contentful paint. */
  readonly priority = input(false);

  protected readonly panelId = `catalogue-details-${nextCardId++}`;
  protected readonly coverFailed = signal(false);

  protected readonly imageSrc = computed(() =>
    this.coverFailed() ? this.config().defaultImage : (this.item().cover ?? this.config().defaultImage));
  protected readonly details = computed<ItemDetail[]>(() => {
    const item = this.item();
    const description = item.description ? [{label: 'Description', value: item.description}] : [];
    const dimensions = this.config().detailFields
      .filter(field => item.dimensions?.[field.key])
      .map(field => ({label: field.label, value: item.dimensions[field.key]}));
    return [...description, ...dimensions];
  });
  protected readonly hasDetails = computed(() => this.details().length > 0);

  // The item picked through the route or the search starts expanded.
  protected readonly open = linkedSignal(() => this.selected());

  protected toggle(): void {
    this.open.update(open => !open);
  }
}
