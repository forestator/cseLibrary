import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';
import {ItemCollection} from '../../models/catalogue-item.model';
import {CATEGORY_ICONS} from '../../models/catalogue-categories';
import {countLabel} from '../../models/count-label';
import {CatalogueCommission} from '../../models/commission-config.model';
import {injectCatalogue} from '../../services/inject-catalogue';
import {CatalogueItemGrid} from '../catalogue-item-grid/catalogue-item-grid';
import {CataloguePageHeader} from '../catalogue-page-header/catalogue-page-header';

@Component({
  selector: 'app-catalogue-home',
  templateUrl: './catalogue-home.html',
  styleUrl: './catalogue-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage, MatIcon, CatalogueItemGrid, CataloguePageHeader],
})
export class CatalogueHome {
  private readonly toolsService = inject(ToolsService);

  // Bound from the route data.
  readonly commission = input.required<CatalogueCommission>();

  private readonly catalogue = injectCatalogue(this.commission);
  protected readonly config = this.catalogue.config;

  protected readonly library = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.library$)));

  private readonly collection = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.allItems$)));
  protected readonly items = computed(() => {
    const collection: ItemCollection | undefined = this.collection();
    return collection ? Object.values(collection) : undefined;
  });
  protected readonly itemsCountLabel = computed(() => {
    const items = this.items();
    return items ? countLabel(items.length) : undefined;
  });

  // Commissions without categories list their items here: the search jumps to an item through the URL fragment.
  protected readonly selectedId = toSignal(inject(ActivatedRoute).fragment);

  // Categorized commissions list their categories, with the number of items of each.
  protected readonly categories = computed(() => {
    const items = this.items() ?? [];
    return (this.library()?.categories ?? []).map(category => ({
      ...category,
      bg: category.bg,
      icon: CATEGORY_ICONS[category.id ?? ''] ?? 'category',
      countLabel: this.items() ? countLabel(items.filter(item => item.categoryId === category.id).length) : undefined,
    }));
  });

  constructor() {
    effect(() => {
      if (this.selectedId() && this.items()?.length) {
        this.toolsService.scrollToId(this.selectedId());
      }
    });
  }
}
