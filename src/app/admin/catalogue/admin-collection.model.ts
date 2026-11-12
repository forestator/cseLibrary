import {Observable} from 'rxjs';
import {CatalogueItem} from '../../catalogue/models/catalogue-item.model';
import {Comissions, Game} from '../../models/common.model';

/** Read-only view of one object, whatever its commission: what the global list shows. */
export interface AdminItem {
  /** Unique across all collections. */
  key: string;
  collectionId: string;
  categoryId?: string;
  name: string;
  ref?: string;
  status?: string;
  cover?: string;
  /** The stored object, handed back to its collection to be edited. */
  source: CatalogueItem | Game;
}

/** One source of objects (a commission, or a library of a commission) managed from the global administration. */
export interface AdminCollection {
  id: string;
  commission: Comissions;
  label: string;
  icon: string;
  /** Whether the signed-in user may add and edit here; the Firestore rules remain the real barrier. */
  canManage$: Observable<boolean>;
  items$: Observable<AdminItem[]>;
  add(): Promise<void>;
  edit(item: AdminItem): Promise<void>;
}

/** A commission as the global administration presents it: pick one, then manage its objects. */
export interface AdminSection {
  /** Commission id, also the last segment of the `/admin/<id>` address. */
  id: string;
  label: string;
  icon: string;
  summary: string;
  canManage$: Observable<boolean>;
  /** The lists of objects of the commission; empty for the library, which has its own editor. */
  collections: ReadonlyArray<AdminCollection>;
}
