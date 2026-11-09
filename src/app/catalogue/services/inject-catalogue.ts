import {computed, inject} from '@angular/core';
import {COMMISSION_CONFIGS} from '../models/commission-configs';
import {CatalogueCommission} from '../models/commission-config.model';
import {CatalogueRepositories} from './catalogue-repositories.service';

/** Resolves the config and repository of the commission given by a (route-bound) input. */
export function injectCatalogue(commission: () => CatalogueCommission) {
  const repositories = inject(CatalogueRepositories);
  const config = computed(() => COMMISSION_CONFIGS[commission()]);
  const repository = computed(() => repositories.of(config()));
  return {config, repository};
}
