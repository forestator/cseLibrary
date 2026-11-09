import {ChangeDetectionStrategy, Component, computed, effect, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';
import {ItemCollection} from '../../models/catalogue-item.model';
import {CatalogueCommission} from '../../models/commission-config.model';
import {injectCatalogue} from '../../services/inject-catalogue';
import {CatalogueItemRow} from '../catalogue-item-row/catalogue-item-row';

@Component({
  selector: 'app-catalogue-category',
  templateUrl: './catalogue-category.html',
  styleUrl: './catalogue-category.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogueItemRow],
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
      switchMap(({repository, categoryId}) => repository.categoryItems$(categoryId))),
    {initialValue: {} as ItemCollection});

  protected readonly category = computed(() =>
    this.library()?.categories?.find(category => category.id === this.categoryId()));
  protected readonly items = computed(() => Object.values(this.collection()));

  constructor() {
    effect(() => {
      const selectedId = this.id();
      if (selectedId && this.items().length) {
        this.toolsService.scrollToId(selectedId);
      }
    });
  }
}
