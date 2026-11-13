import {Injector, untracked} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {defer, filter, map} from 'rxjs';
import {authorNames} from '../../bibliotheque/models/library-queries';
import {BookEntry, flattenBooks} from '../../bibliotheque/models/library-books';
import {LibraryRepository} from '../../bibliotheque/services/library.repository';
import {Biblio, Book, BookStatus, ViewBy} from '../../models/author.model';
import {Comissions} from '../../models/common.model';
import {CloudinaryService} from '../../services/cloudinary.service';
import {StorageUploadService} from '../../services/firebase/storage-upload.service';
import {AdminField, AdminFieldOption, AdminFormSection, AdminFormValues} from '../form/admin-form.model';
import {toFormValues, toStoredEntry} from '../form/admin-form';
import {AdminCollection, AdminItem} from './admin-collection.model';

export interface LibraryCollectionDeps {
  libraryId: string;
  label: string;
  icon: string;
  injector: Injector;
  upload: StorageUploadService;
  cloudinary: CloudinaryService;
  canManage$: AdminCollection['canManage$'];
}

const BOOK_STATUSES: ReadonlyArray<AdminFieldOption> = [
  {value: BookStatus.AVAILABLE, label: 'Disponible'},
  {value: BookStatus.NEW, label: 'Nouveau'},
  {value: BookStatus.IN_PROJECT, label: 'En projet'},
  {value: BookStatus.DECLASSED, label: 'Déclassé'},
  {value: BookStatus.MISSING, label: 'Perdu'},
];

/** Fields the form edits that are stored on the book as they are. */
const STORED_FIELDS: ReadonlyArray<AdminField> = [
  {key: 'name', label: 'Titre', kind: 'text', required: true},
  {key: 'ref', label: 'Cote', kind: 'text', placeholder: 'R-ADL'},
  {key: 'status', label: 'Statut', kind: 'status', required: true, options: BOOK_STATUSES},
  {key: 'tome', label: 'Tome', kind: 'text'},
  {key: 'year', label: 'Année', kind: 'text'},
  {key: 'isbn13', label: 'ISBN-13', kind: 'text'},
  {key: 'isbn10', label: 'ISBN-10', kind: 'text'},
  {key: 'page', label: 'Pages', kind: 'text'},
  {key: 'format', label: 'Format', kind: 'text'},
  {key: 'date', label: 'Date de parution', kind: 'text'},
  {key: 'resume', label: 'Résumé', kind: 'textarea'},
];

// What a book holds when the form leaves a field empty: the empty strings the catalogue has always had.
const BLANK_BOOK = {
  name: '', ref: '', tome: '', year: '', isbn13: '', isbn10: '', page: '', format: '', date: '', resume: '', cover: 'NoCover.jpg',
  publisherId: undefined, authorIds: [] as Array<string | undefined>, by: undefined,
};

function coverUrl(cloudinary: CloudinaryService, biblio: Biblio, book: Book): string | undefined {
  return book.cover && book.cover !== 'NoCover.jpg'
    ? cloudinary.urlForPath(`assets/books/covers/${biblio.library.path}/${book.cover}`) : undefined;
}

/** One library of the library commission as an administration collection, books being its objects. */
export function createLibraryCollection(deps: LibraryCollectionDeps): AdminCollection {
  const {libraryId, injector} = deps;
  // Resolved on use, never at construction: the four libraries are read from Firestore when the repository is created.
  const repository = () => untracked(() => injector.get(LibraryRepository));
  const biblio = () => repository().libraries()?.find(candidate => candidate.library.id === libraryId);

  const storedFields = STORED_FIELDS;
  const toItem = (entry: BookEntry, current: Biblio): AdminItem => ({
    key: entry.locator.id ?? `${entry.locator.categoryId}/${entry.locator.containerId ?? ''}/${entry.locator.position}`,
    id: entry.book.id ?? '',
    collectionId: libraryId,
    categoryId: entry.category.id,
    categoryName: entry.category.name,
    name: entry.book.name,
    ref: entry.book.ref,
    status: entry.book.status,
    cover: coverUrl(deps.cloudinary, current, entry.book),
    searchText: `${authorNames(entry.book.authorIds, current)} ${entry.series?.name ?? ''}`,
    source: entry,
  });
  const locators = (items: ReadonlyArray<AdminItem>) => items.map(item => (item.source as BookEntry).locator);

  return {
    id: libraryId,
    commission: Comissions.BIBLIOTHEQUE,
    label: deps.label,
    icon: deps.icon,
    canManage$: deps.canManage$,
    items$: defer(() => toObservable(repository().libraries, {injector})).pipe(
      map(() => biblio()),
      filter((current): current is Biblio => !!current),
      map(current => flattenBooks(current).map(entry => toItem(entry, current)))),
    get form() {
      const current = biblio();
      const info: AdminField[] = [
        storedFields[0],
        {key: 'category', label: 'Catégorie', kind: 'select', required: true,
          options: (current?.library.categories ?? []).map(category => ({value: category.id ?? '', label: category.name}))},
        {key: 'author', label: 'Auteur', kind: 'text', requiredWhenAdding: true, placeholder: 'Prénom Nom'},
        ...(current?.library.by === ViewBy.BY_SERIES ? [{key: 'series', label: 'Série', kind: 'text' as const, placeholder: 'Divers'}] : []),
        ...storedFields.slice(1, 3),
      ];
      const sections: AdminFormSection[] = [
        {id: 'info', title: 'Livre', fields: info},
        {id: 'details', title: 'Détails', fields: storedFields.slice(3)},
      ];
      return {noun: 'un livre', sections, defaults: {status: BookStatus.AVAILABLE}};
    },
    initialValues: item => {
      const entry = item.source as BookEntry;
      const current = biblio() as Biblio;
      return {
        ...toFormValues(entry.book as unknown as Record<string, unknown>, storedFields),
        category: entry.category.id ?? '',
        author: authorNames(entry.book.authorIds, current),
        series: entry.series?.name ?? '',
      } as AdminFormValues;
    },
    existingKeys: async () => [],
    uploadCover: (file, values) => deps.upload.uploadCover(file, `assets/books/covers/${biblio()?.library.path}`, String(values['name'])),
    save: async ({values, cover, original}) => {
      const entry = original?.source as BookEntry | undefined;
      const stored = toStoredEntry(entry && {...entry.book}, values, storedFields);
      // The cover is a file name relative to the library folder: the URL Cloudinary returns ends with it.
      const book = {...BLANK_BOOK, ...stored, ...(cover ? {cover: cover.split('/').pop() as string} : {})} as unknown as Book;
      await repository().saveBook(libraryId, {
        original: entry?.locator,
        book,
        categoryId: String(values['category']),
        authorName: String(values['author'] ?? ''),
        seriesName: String(values['series'] ?? ''),
      });
    },
    remove: item => repository().removeBooks(libraryId, locators([item])),
    statuses: BOOK_STATUSES,
    setStatus: (items, status) => repository().setBooksStatus(libraryId, locators(items), status as BookStatus),
    removeMany: items => repository().removeBooks(libraryId, locators(items)),
  };
}
