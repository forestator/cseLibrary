import {inject, Injectable} from '@angular/core';
import {Firestore} from '@angular/fire/firestore';
import {CommissionConfig} from '../models/commission-config.model';
import {CatalogueRepository} from './catalogue-repository';

@Injectable({providedIn: 'root'})
export class CatalogueRepositories {
  private readonly firestore = inject(Firestore);
  private readonly repositories = new Map<string, CatalogueRepository>();

  of(config: CommissionConfig): CatalogueRepository {
    let repository = this.repositories.get(config.id);
    if (!repository) {
      repository = new CatalogueRepository(config, this.firestore);
      this.repositories.set(config.id, repository);
    }
    return repository;
  }
}
