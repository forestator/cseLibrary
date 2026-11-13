import {Observable} from 'rxjs';
import {BookEntry} from '../../bibliotheque/models/library-books';
import {CatalogueItem} from '../../catalogue/models/catalogue-item.model';
import {Comissions, Game} from '../../models/common.model';
import {CloudinaryUploadState} from '../../services/cloudinary.service';
import {AdminFieldOption, AdminFormSection, AdminFormValues} from '../form/admin-form.model';

/** Read-only view of one object, whatever its commission: what the global list shows. */
export interface AdminItem {
  /** Unique across all collections. */
  key: string;
  /** Identifier inside its collection: the reference of a game, the id of a catalogue item. */
  id: string;
  collectionId: string;
  categoryId?: string;
  /** Shown instead of a label derived from `categoryId`, when the id means nothing to a reader (books). */
  categoryName?: string;
  name: string;
  ref?: string;
  status?: string;
  cover?: string;
  /** The stored object, handed back to its collection to be edited. */
  /** Words, besides the name, that the search looks into (a book's authors and series). */
  searchText?: string;
  source: CatalogueItem | Game | BookEntry;
}

/** How the form of a collection looks and which field identifies its items. */
export interface AdminFormDefinition {
  /** "un jeu", "un outil": used in titles and messages. */
  noun: string;
  /** Form field holding the identifier, which must be unique. Absent when items have no identifier of their own (books). */
  keyField?: string;
  sections: ReadonlyArray<AdminFormSection>;
  /** Initial values of a new item. */
  defaults: AdminFormValues;
}

/** Optional help to fill a form from an outside source (BoardGameGeek for board games). */
export interface AdminAssist {
  searchLabel: string;
  fillLabel: string;
  /** Lets the user pick the matching entry for `name`; resolves with its identifier. */
  pick(name: string): Promise<string | undefined>;
  /** Details to put in the form once the entry is known; `extra` holds stored fields the form does not show. */
  fill(values: AdminFormValues): Promise<{values: AdminFormValues; extra: Record<string, unknown>}>;
}

export interface AdminSaveRequest {
  values: AdminFormValues;
  /** Public URL of a cover uploaded while the form was open. */
  cover?: string;
  /** Stored fields the form does not show but the assist found. */
  extra?: Record<string, unknown>;
  /** The item being edited; absent when adding. */
  original?: AdminItem;
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
  /** A getter for collections whose options come from loaded data. */
  readonly form: AdminFormDefinition;
  assist?: AdminAssist;
  /** Form values of an item being edited, when they are not simply its stored fields. */
  initialValues?(item: AdminItem): AdminFormValues;
  /** Identifiers already used, to keep new ones unique. */
  existingKeys(): Promise<string[]>;
  /** Uploads an image and reports its URL; nothing is written until the item is saved. */
  uploadCover(file: File, values: AdminFormValues): Observable<CloudinaryUploadState>;
  save(request: AdminSaveRequest): Promise<void>;
  remove(item: AdminItem): Promise<void>;
  /** Statuses an item can be set to. */
  statuses: ReadonlyArray<AdminFieldOption>;
  /** Bulk actions: each is one write for all the given items, which belong to this collection. */
  setStatus(items: ReadonlyArray<AdminItem>, status: string): Promise<void>;
  removeMany(items: ReadonlyArray<AdminItem>): Promise<void>;
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
