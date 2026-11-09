import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {CatalogueItem, ItemCollection} from '../../models/catalogue-item.model';
import {CatalogueCommission} from '../../models/commission-config.model';
import {injectCatalogue} from '../../services/inject-catalogue';

@Component({
  selector: 'app-catalogue-menu',
  templateUrl: './catalogue-menu.html',
  styleUrl: './catalogue-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatIcon],
})
export class CatalogueMenu {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  readonly commission = input.required<CatalogueCommission>();

  private readonly catalogue = injectCatalogue(this.commission);
  protected readonly config = this.catalogue.config;
  protected readonly placeholder = computed(() => this.config().searchPlaceholder ?? 'Rechercher');

  protected readonly searchText = new FormControl<string | CatalogueItem>('', {nonNullable: true});
  private readonly searchValue = toSignal(this.searchText.valueChanges, {initialValue: ''});
  private readonly collection = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.allItems$)),
    {initialValue: {} as ItemCollection});

  protected readonly filteredItems = computed(() => {
    const value = this.searchValue();
    const filterValue = (typeof value === 'string' ? value : value.name).toLowerCase();
    return Object.values(this.collection()).filter(item => item.name?.toLowerCase().includes(filterValue));
  });

  protected readonly displayItem = (item?: CatalogueItem | string): string =>
    typeof item === 'string' ? item : (item?.name ?? '');

  protected goToSelectedItem(event: MatAutocompleteSelectedEvent) {
    const item: CatalogueItem = event.option.value;
    if (this.config().categories) {
      this.navigationService.goToCatalogueItem(this.commission(), item);
    } else {
      // Commissions without categories show every item on their home page.
      this.router.navigate(['/', this.commission()], {fragment: item.id});
    }
  }
}
