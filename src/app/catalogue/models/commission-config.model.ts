import {Observable} from 'rxjs';
import {Comissions} from '../../models/common.model';
import {AuthentificationService} from '../../services/firebase/authentification.service';
import {ItemDimensions} from './catalogue-item.model';

export type CatalogueCommission =
  Comissions.BRICOLAGE | Comissions.SONOTHEQUE | Comissions.NAUTISME | Comissions.PHOTO;

export type AdminGuardKey = {
  [Key in keyof AuthentificationService]: AuthentificationService[Key] extends Observable<boolean> ? Key : never
}[keyof AuthentificationService];

export interface StatusOption {
  value: string;
  label: string;
}

export interface DetailField {
  key: keyof ItemDimensions;
  label: string;
}

export interface CommissionAdminTexts {
  addTitle: string;
  editTitle: string;
  namePlaceholder: string;
}

export interface CommissionAdminConfig {
  /** Folder (in the cover upload path) under which covers of this commission are stored. */
  coverPath: string;
  statuses: readonly StatusOption[];
  texts: CommissionAdminTexts;
}

export interface CommissionConfig {
  id: CatalogueCommission;
  libraryPath: string;
  itemsPath: string;
  /** Ordered category ids, or null when the commission has a single flat list of items. */
  categories: readonly string[] | null;
  /** Name of the field holding the category id in the stored items. */
  categoryField: 'category' | 'categoryId' | null;
  defaultImage: string;
  /** Status assumed for stored items that have none. */
  defaultStatus?: string;
  showRef: boolean;
  detailFields: readonly DetailField[];
  searchPlaceholder?: string;
  adminLink: {
    guard: AdminGuardKey;
  };
  admin?: CommissionAdminConfig;
}
