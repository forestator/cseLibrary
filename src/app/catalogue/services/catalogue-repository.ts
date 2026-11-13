import {DocumentReference, Firestore, doc, docData} from '@angular/fire/firestore';
import {map, Observable, shareReplay, take} from 'rxjs';
import {removeAtPath, saveAtPath} from '../../services/firestore/document-paths';
import {Library} from '../../models/author.model';
import {CatalogueItem, ItemCollection} from '../models/catalogue-item.model';
import {CommissionConfig} from '../models/commission-config.model';
import {StoredCollection, toCategorizedCollection, toCollection, toStored} from './catalogue-mapper';

type CommissionDocument = Record<string, unknown>;

/**
 * Single access point to the data of one commission. Its public API only speaks in collections of items
 * keyed by id; the storage (one Firestore document `commissions/{id}` shaped `{library, <items field>}`, see
 * docs/firestore-model.md) is private to this class.
 */
export class CatalogueRepository {
  readonly library$: Observable<Library>;
  readonly allItems$: Observable<ItemCollection>;

  private readonly reference: DocumentReference;
  private readonly libraryField: string;
  private readonly itemsField: string;
  private readonly commissionDocument$: Observable<CommissionDocument | undefined>;

  constructor(private readonly config: CommissionConfig, firestore: Firestore) {
    // Paths keep their historical "<commission>/<field>" shape: the first segment is the document, the second the field.
    const [documentId, libraryField] = config.libraryPath.split('/');
    this.libraryField = libraryField;
    this.itemsField = config.itemsPath.split('/')[1];
    this.reference = doc(firestore, 'commissions', documentId);
    this.commissionDocument$ = (docData(this.reference) as Observable<CommissionDocument | undefined>).pipe(
      shareReplay({bufferSize: 1, refCount: true})
    );

    this.library$ = this.commissionDocument$.pipe(
      map(document => document?.[this.libraryField] as Library),
      take(1),
      shareReplay({bufferSize: 1, refCount: false})
    );
    this.allItems$ = this.commissionDocument$.pipe(
      map(document => {
        const stored = document?.[this.itemsField] as StoredCollection | Record<string, StoredCollection> | undefined;
        return config.categories
          ? toCategorizedCollection(config, stored as Record<string, StoredCollection>)
          : toCollection(config, stored as StoredCollection);
      })
    );
  }

  categoryItems$(categoryId: string): Observable<ItemCollection> {
    return this.commissionDocument$.pipe(
      map(document => {
        const byCategory = document?.[this.itemsField] as Record<string, StoredCollection> | undefined;
        return toCollection(this.config, byCategory?.[categoryId], categoryId);
      })
    );
  }

  /** Writes the item whole; when it moved (new id or category) the entry it replaces is removed in the same update. */
  save(item: CatalogueItem, previous?: CatalogueItem): Promise<void> {
    return saveAtPath(this.reference, this.itemPath(item), toStored(this.config, item), previous && this.itemPath(previous));
  }

  remove(item: CatalogueItem): Promise<void> {
    return removeAtPath(this.reference, this.itemPath(item));
  }

  private itemPath(item: CatalogueItem): string[] {
    return this.config.categories
      ? [this.itemsField, item.categoryId ?? '', item.id]
      : [this.itemsField, item.id];
  }
}
