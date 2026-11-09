import {ChangeDetectionStrategy, Component, computed, effect, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';
import {ItemCollection} from '../../models/catalogue-item.model';
import {countLabel} from '../../models/count-label';
import {CatalogueCommission} from '../../models/commission-config.model';
import {injectCatalogue} from '../../services/inject-catalogue';
import {CatalogueItemGrid} from '../catalogue-item-grid/catalogue-item-grid';
import {CataloguePageHeader} from '../catalogue-page-header/catalogue-page-header';

@Component({
  selector: 'app-catalogue-category',
  templateUrl: './catalogue-category.html',
  styleUrl: './catalogue-category.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CatalogueItemGrid, CataloguePageHeader],
})
export class CatalogueCategory {
  private readonly toolsService = inject(ToolsService);

  // Bound from the route data and params.
  readonly commission = input.required<CatalogueCommission>();
  readonly categoryId = input.required<string>();
  readonly id = input<string>();

  private readonly catalogue = injectCatalogue(this.commission);
  protected readonly config = this.catalogue.config;

  private readonly library = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.library$)));
  private readonly collection = toSignal(
    toObservable(computed(() => ({repository: this.catalogue.repository(), categoryId: this.categoryId()}))).pipe(
      switchMap(({repository, categoryId}) => repository.categoryItems$(categoryId))));

  protected readonly categories = computed(() => this.library()?.categories ?? []);
  protected readonly category = computed(() => this.categories().find(category => category.id === this.categoryId()));
  protected readonly items = computed(() => {
    const collection: ItemCollection | undefined = this.collection();
    return collection ? Object.values(collection) : undefined;
  });
  protected readonly itemsCountLabel = computed(() => {
    const count = this.items()?.length;
    return count === undefined ? undefined : countLabel(count);
  });

  constructor() {
    effect(() => {
      const selectedId = this.id();
      if (selectedId && this.items()?.length) {
        this.toolsService.scrollToId(selectedId);
      }
    });
  }
}
