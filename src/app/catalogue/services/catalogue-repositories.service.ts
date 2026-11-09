import {inject, Injectable, Injector} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {CommissionConfig} from '../models/commission-config.model';
import {CatalogueRepository} from './catalogue-repository';

@Injectable({providedIn: 'root'})
export class CatalogueRepositories {
  private readonly db = inject(AngularFireDatabase);
  private readonly injector = inject(Injector);
  private readonly repositories = new Map<string, CatalogueRepository>();

  of(config: CommissionConfig): CatalogueRepository {
    let repository = this.repositories.get(config.id);
    if (!repository) {
      repository = new CatalogueRepository(config, this.db, this.injector);
      this.repositories.set(config.id, repository);
    }
    return repository;
  }
}
