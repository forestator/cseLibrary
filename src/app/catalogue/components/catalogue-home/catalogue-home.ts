import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {of, switchMap} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {ItemCollection} from '../../models/catalogue-item.model';
import {CatalogueCommission} from '../../models/commission-config.model';
import {injectCatalogue} from '../../services/inject-catalogue';
import {CatalogueItemRow} from '../catalogue-item-row/catalogue-item-row';

@Component({
  selector: 'app-catalogue-home',
  templateUrl: './catalogue-home.html',
  styleUrl: './catalogue-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CatalogueItemRow],
})
export class CatalogueHome {
  private readonly auth = inject(AuthentificationService);

  // Bound from the route data.
  readonly commission = input.required<CatalogueCommission>();

  private readonly catalogue = injectCatalogue(this.commission);
  protected readonly config = this.catalogue.config;

  protected readonly mobile = toSignal(inject(ToolsService).mobilePhoneDisplay$, {initialValue: false});
  protected readonly library = toSignal(
    toObservable(this.catalogue.repository).pipe(switchMap(repository => repository.library$)));
  protected readonly isAdmin = toSignal(
    toObservable(this.config).pipe(switchMap(config => this.auth[config.adminLink.guard])),
    {initialValue: false});

  // Categorized commissions list their categories; the others list their items directly.
  private readonly flatCollection = toSignal(
    toObservable(this.catalogue.repository).pipe(
      switchMap(repository => this.config().categories ? of({} as ItemCollection) : repository.allItems$)),
    {initialValue: {} as ItemCollection});
  protected readonly flatItems = computed(() => Object.values(this.flatCollection()));
}
