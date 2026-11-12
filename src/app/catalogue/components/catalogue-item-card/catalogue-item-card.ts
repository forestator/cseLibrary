import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked} from '@angular/core';
import {DetailPanelService} from '../../../common/components/detail-panel/detail-panel.service';
import {BadgeComponent} from '../../../common/components/book-badge/badge.component';
import {CatalogueItem} from '../../models/catalogue-item.model';
import {CommissionConfig} from '../../models/commission-config.model';

interface ItemDetail {
  label: string;
  value: string;
}

@Component({
  selector: 'app-catalogue-item-card',
  templateUrl: './catalogue-item-card.html',
  styleUrl: './catalogue-item-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, NgOptimizedImage],
  host: {class: 'catalogue-card', '[id]': 'item().id', '[class.catalogue-card-selected]': 'selected()'},
})
export class CatalogueItemCard {
  private readonly detailPanel = inject(DetailPanelService);

  readonly item = input.required<CatalogueItem>();
  readonly config = input.required<CommissionConfig>();
  readonly selected = input(false);
  /** Cards of the first row are loaded eagerly: they are the largest contentful paint. */
  readonly priority = input(false);

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

  constructor() {
    // The item picked through the route or the search opens its panel right away.
    effect(() => {
      if (this.selected() && this.hasDetails()) {
        untracked(() => this.openDetails());
      }
    });
  }

  protected openDetails(): void {
    const item = this.item();
    const config = this.config();
    this.detailPanel.open({
      title: item.name,
      cover: this.imageSrc(),
      coverAlt: item.name,
      facts: config.showRef ? [{icon: 'tag', label: `Réf. ${item.id}`}] : [],
      lines: [],
      properties: this.details().filter(detail => detail.label !== 'Description'),
      descriptionText: item.description,
    });
  }
}
