import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, shareReplay, take} from 'rxjs';
import {Library} from '../../models/author.model';
import {CatalogueItem, ItemCollection} from '../models/catalogue-item.model';
import {CommissionConfig} from '../models/commission-config.model';

type StoredItem = Partial<CatalogueItem> & {category?: string};
type StoredCollection = Record<string, StoredItem>;

/**
 * Single access point to the data of one commission. Its public API only speaks in
 * collections of items keyed by id, so the Realtime Database can be replaced by another
 * backend by rewriting this class alone.
 */
export class CatalogueRepository {
  readonly library$: Observable<Library>;
  readonly allItems$: Observable<ItemCollection>;

  constructor(private readonly config: CommissionConfig, private readonly db: AngularFireDatabase) {
    this.library$ = this.db.object<Library>(config.libraryPath).valueChanges().pipe(
      take(1),
      shareReplay({bufferSize: 1, refCount: false})
    );
    this.allItems$ = config.categories ? this.allCategorizedItems$() : this.flatItems$();
  }

  categoryItems$(categoryId: string): Observable<ItemCollection> {
    return this.db.object<StoredCollection>(`${this.config.itemsPath}/${categoryId}`).valueChanges().pipe(
      map(stored => this.toCollection(stored, categoryId))
    );
  }

  add(item: CatalogueItem): Promise<void> {
    return this.db.object(this.itemPath(item)).update(this.toStored(item));
  }

  update(item: CatalogueItem, changes: Partial<CatalogueItem>): Promise<void> {
    return this.db.object(this.itemPath(item)).update(this.withoutUndefined(changes));
  }

  updateCover(item: CatalogueItem, coverUrl: string): Promise<void> {
    return this.update(item, {cover: coverUrl});
  }

  remove(item: CatalogueItem): Promise<void> {
    return this.db.object(this.itemPath(item)).remove();
  }

  private allCategorizedItems$(): Observable<ItemCollection> {
    return this.db.object<Record<string, StoredCollection>>(this.config.itemsPath).valueChanges().pipe(
      map(storedByCategory => {
        const all: ItemCollection = {};
        for (const categoryId of this.config.categories ?? []) {
          const items = this.toCollection(storedByCategory?.[categoryId], categoryId);
          for (const item of Object.values(items)) {
            all[`${categoryId}/${item.id}`] = item;
          }
        }
        return all;
      })
    );
  }

  private flatItems$(): Observable<ItemCollection> {
    return this.db.object<StoredCollection>(this.config.itemsPath).valueChanges().pipe(
      map(stored => this.toCollection(stored))
    );
  }

  private toCollection(stored: StoredCollection | null, categoryId?: string): ItemCollection {
    const collection: ItemCollection = {};
    for (const [key, storedItem] of Object.entries(stored ?? {})) {
      const {category, ...fields} = storedItem;
      collection[key] = {
        ...fields,
        id: String(storedItem.id ?? key),
        name: storedItem.name,
        categoryId,
        status: storedItem.status ?? this.config.defaultStatus,
      };
    }
    return collection;
  }

  private itemPath(item: CatalogueItem): string {
    return this.config.categories
      ? `${this.config.itemsPath}/${item.categoryId}/${item.id}`
      : `${this.config.itemsPath}/${item.id}`;
  }

  private toStored(item: CatalogueItem): Record<string, unknown> {
    const {categoryId, ...fields} = item;
    const stored: Record<string, unknown> = {...fields};
    if (this.config.categoryField && categoryId) {
      stored[this.config.categoryField] = categoryId;
    }
    return this.withoutUndefined(stored);
  }

  // The Realtime Database rejects undefined values.
  private withoutUndefined<T extends object>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, field]) => field !== undefined)) as T;
  }
}
