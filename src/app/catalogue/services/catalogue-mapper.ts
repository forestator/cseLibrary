import {CatalogueItem, ItemCollection} from '../models/catalogue-item.model';
import {CommissionConfig} from '../models/commission-config.model';

type StoredItem = Partial<CatalogueItem> & {category?: string};
export type StoredCollection = Record<string, StoredItem>;

/** Turns the stored items of one category (or of a flat commission) into catalogue items keyed by storage key. */
export function toCollection(config: CommissionConfig, stored?: StoredCollection | null, categoryId?: string): ItemCollection {
  const collection: ItemCollection = {};
  for (const [key, storedItem] of Object.entries(stored ?? {})) {
    const {category, ...fields} = storedItem;
    collection[key] = {
      ...fields,
      id: String(storedItem.id ?? key),
      name: storedItem.name,
      categoryId,
      status: storedItem.status ?? config.defaultStatus,
    };
  }
  return collection;
}

/** Merges the categories in config order, keys becoming `categoryId/id`. */
export function toCategorizedCollection(config: CommissionConfig, storedByCategory?: Record<string, StoredCollection> | null): ItemCollection {
  const all: ItemCollection = {};
  for (const categoryId of config.categories ?? []) {
    for (const item of Object.values(toCollection(config, storedByCategory?.[categoryId], categoryId))) {
      all[`${categoryId}/${item.id}`] = item;
    }
  }
  return all;
}

/** Fields written to the database: the category id goes back under the field name the data has always used. */
export function toStored(config: CommissionConfig, item: CatalogueItem): Record<string, unknown> {
  const {categoryId, ...fields} = item;
  const stored: Record<string, unknown> = {...fields};
  if (config.categoryField && categoryId) {
    stored[config.categoryField] = categoryId;
  }
  return stored;
}
