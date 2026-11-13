import {firstValueFrom, map} from 'rxjs';
import {CatalogueItem} from '../../catalogue/models/catalogue-item.model';
import {CommissionConfig} from '../../catalogue/models/commission-config.model';
import {CatalogueRepository} from '../../catalogue/services/catalogue-repository';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {StorageUploadService} from '../../services/firebase/storage-upload.service';
import {AdminField, AdminFormSection} from '../form/admin-form.model';
import {toStoredEntry} from '../form/admin-form';
import {AdminCollection, AdminItem} from './admin-collection.model';

export interface CatalogueCollectionDeps {
  config: CommissionConfig;
  label: string;
  icon: string;
  noun: string;
  repository: CatalogueRepository;
  upload: StorageUploadService;
  canManage$: AdminCollection['canManage$'];
}

function catalogueSections(config: CommissionConfig): ReadonlyArray<AdminFormSection> {
  const info: AdminField[] = [
    {key: 'name', label: 'Nom', kind: 'text', required: true, placeholder: config.admin.texts.namePlaceholder},
    {key: 'id', label: 'Référence', kind: 'text', required: true},
  ];
  if (config.categories) {
    info.push({
      key: 'categoryId', label: 'Catégorie', kind: 'select', required: true,
      options: config.categories.map(value => ({value, label: categoryLabel(value)})),
    });
  }
  info.push(
    {key: 'description', label: 'Description', kind: 'textarea'},
    {key: 'status', label: 'Statut', kind: 'status', required: true, options: config.admin.statuses},
  );
  const sections: AdminFormSection[] = [{id: 'info', title: 'Informations', fields: info}];
  if (config.detailFields.length) {
    sections.push({
      id: 'dimensions', title: 'Dimensions',
      fields: config.detailFields.map(field => ({key: `dimensions.${field.key}`, label: field.label, kind: 'text' as const})),
    });
  }
  return sections;
}

/** One commission of the simple catalogue (bricolage, sonothèque, nautisme, photo) as an administration collection. */
export function createCatalogueCollection(deps: CatalogueCollectionDeps): AdminCollection {
  const {config, repository} = deps;
  const stored$ = repository.allItems$.pipe(map(collection => Object.values(collection)));
  const sections = catalogueSections(config);
  const fields = sections.flatMap(section => section.fields);

  return {
    id: config.id,
    commission: config.id,
    label: deps.label,
    icon: deps.icon,
    canManage$: deps.canManage$,
    items$: stored$.pipe(map(items => items.map(item => ({
      key: `${config.id}/${item.categoryId ?? ''}/${item.id}`,
      id: item.id,
      collectionId: config.id,
      categoryId: item.categoryId,
      name: item.name,
      ref: config.showRef ? item.id : undefined,
      status: item.status ?? config.defaultStatus,
      cover: item.cover,
      source: item,
    })))),
    form: {
      noun: deps.noun,
      keyField: 'id',
      sections,
      defaults: {status: config.defaultStatus ?? 'AVAILABLE'},
    },
    existingKeys: async () => (await firstValueFrom(stored$)).map(item => item.id),
    uploadCover: (file, values) => {
      const folder = config.categories ? `${config.admin.coverPath}/${values['categoryId']}` : config.admin.coverPath;
      return deps.upload.uploadCover(file, folder, String(values['name']));
    },
    save: async ({values, cover, original}) => {
      const previous = original?.source as CatalogueItem | undefined;
      const entry = toStoredEntry(previous && {...previous}, values, fields) as unknown as CatalogueItem;
      if (cover) {
        entry.cover = cover;
      }
      await repository.save(entry, previous);
    },
    remove: (item: AdminItem) => repository.remove(item.source as CatalogueItem),
    statuses: config.admin.statuses,
    setStatus: (items, status) => repository.setStatus(items.map(item => item.source as CatalogueItem), status),
    removeMany: items => repository.removeItems(items.map(item => item.source as CatalogueItem)),
    addMany: entries => repository.addItems(entries.map(values => toStoredEntry(undefined, values, fields) as unknown as CatalogueItem)),
    moveMany: moves => repository.moveItems(moves.map(({item, category}) => ({item: item.source as CatalogueItem, categoryId: category}))),
  };
}
