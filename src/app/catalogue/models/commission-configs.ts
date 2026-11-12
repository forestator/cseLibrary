import {Comissions} from '../../models/common.model';
import {BricoCategories, PhotoCategory, SonoCategory} from './catalogue-categories';
import {CatalogueCommission, CommissionConfig, StatusOption} from './commission-config.model';

const AVAILABLE: StatusOption = {value: 'AVAILABLE', label: 'Disponible'};
const OUT_OF_ORDER_OR_LOST: readonly StatusOption[] = [
  AVAILABLE,
  {value: 'HS', label: 'Hors-Service'},
  {value: 'MISSING', label: 'Perdu'},
];

const CLOUDINARY_ASSETS = 'https://res.cloudinary.com/seo9axkp/image/upload/assets';

export const BRICOLAGE_CONFIG: CommissionConfig = {
  id: Comissions.BRICOLAGE,
  libraryPath: 'bricolage/library',
  itemsPath: 'bricolage/tools',
  categories: Object.values(BricoCategories),
  categoryField: 'categoryId',
  defaultImage: `${CLOUDINARY_ASSETS}/tools/covers/defaultTool`,
  showRef: true,
  detailFields: [
    {key: 'longueur', label: 'Longueur'},
    {key: 'largeur', label: 'Largeur'},
    {key: 'hauteur', label: 'Hauteur'},
    {key: 'PTAC', label: 'PTAC'},
    {key: 'PV', label: 'PV'},
    {key: 'volume', label: 'Volume'},
  ],
  searchPlaceholder: 'Rechercher un outil',
  adminLink: {
    guard: 'isUserBricolageAdmin$',
  },
  admin: {
    coverPath: '/assets/tools/covers',
    statuses: [AVAILABLE, {value: 'REPARATION', label: 'En Réparation'}, {value: 'HS', label: 'HS'}],
    texts: {
      addTitle: 'Ajouter un outil',
      editTitle: 'Modifier un outil',
      namePlaceholder: 'Rotototor',
    },
  },
};

export const SONOTHEQUE_CONFIG: CommissionConfig = {
  id: Comissions.SONOTHEQUE,
  libraryPath: 'sonotheque/library',
  itemsPath: 'sonotheque/items',
  categories: Object.values(SonoCategory),
  categoryField: 'category',
  defaultImage: `${CLOUDINARY_ASSETS}/sonoItems/defaultSonoIItem`,
  defaultStatus: AVAILABLE.value,
  showRef: true,
  detailFields: [],
  adminLink: {
    guard: 'isUserSonoAdmin$',
  },
  admin: {
    coverPath: '/assets/sonoItems/covers',
    statuses: OUT_OF_ORDER_OR_LOST,
    texts: {
      addTitle: 'Ajouter un item',
      editTitle: 'Modifier un item de la sonothèque',
      namePlaceholder: 'Jeux de lumière',
    },
  },
};

export const NAUTISME_CONFIG: CommissionConfig = {
  id: Comissions.NAUTISME,
  libraryPath: 'nautisme/library',
  itemsPath: 'nautisme/items',
  categories: null,
  categoryField: null,
  defaultImage: `${CLOUDINARY_ASSETS}/nautismeItems/nautismeDefaultImage`,
  defaultStatus: AVAILABLE.value,
  showRef: false,
  detailFields: [],
  adminLink: {
    guard: 'isUserNautismeAdmin$',
  },
  admin: {
    coverPath: '/assets/nautisme/covers',
    statuses: OUT_OF_ORDER_OR_LOST,
    texts: {
      addTitle: 'Ajouter un item',
      editTitle: 'Modifier un item nautique',
      namePlaceholder: 'Jeux de lumière',
    },
  },
};

export const PHOTO_CONFIG: CommissionConfig = {
  id: Comissions.PHOTO,
  libraryPath: 'photo/library',
  itemsPath: 'photo/items',
  categories: Object.values(PhotoCategory),
  categoryField: 'category',
  defaultImage: `${CLOUDINARY_ASSETS}/materielPhoto/defaultPhoto`,
  defaultStatus: AVAILABLE.value,
  showRef: false,
  detailFields: [],
  adminLink: {
    guard: 'isUserSuperAdmin',
  },
  admin: {
    coverPath: '/assets/materielPhoto/covers',
    statuses: OUT_OF_ORDER_OR_LOST,
    texts: {
      addTitle: 'Ajouter un équipement',
      editTitle: 'Modifier un équipement photo',
      namePlaceholder: 'Reflex numérique',
    },
  },
};

export const COMMISSION_CONFIGS: Record<CatalogueCommission, CommissionConfig> = {
  [Comissions.BRICOLAGE]: BRICOLAGE_CONFIG,
  [Comissions.SONOTHEQUE]: SONOTHEQUE_CONFIG,
  [Comissions.NAUTISME]: NAUTISME_CONFIG,
  [Comissions.PHOTO]: PHOTO_CONFIG,
};
