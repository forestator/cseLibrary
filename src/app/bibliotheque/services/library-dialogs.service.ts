import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {
  Author,
  Biblio,
  Book,
  BookStatus,
  Category,
  Library,
  Publisher,
  SearchBookResult,
  Series,
  SeriesStatus,
  ViewBy,
} from '../../models/author.model';
import {GoogleBookService} from '../../services/biblio/google-book.service';
import {DeleteModalComponent} from '../components/modals/delete-modal/delete-modal.component';
import {FormDialogComponent} from '../components/modals/form-dialog/form-dialog.component';
import {DialogForm, FormDialogData, FormField, FormValues} from '../components/modals/form-dialog/form-dialog.model';
import {SearchModalComponent} from '../components/modals/search-modal/search-modal.component';

/** Whatever receives a new entity: its id and display mode are inherited by the child. */
export interface DialogParent {
  id?: string;
  by?: ViewBy;
}

const DIALOG_WIDTH = '1200px';
const NO_COVER = 'NoCover.jpg';

function isSeries(parent: Series | Author): parent is Series {
  return 'status' in parent;
}

function enumOptions(values: Record<string, string>) {
  return Object.keys(values).map(key => ({value: key, label: key}));
}

function authorOptions(biblio: Biblio) {
  return (biblio.authors ?? []).map(author => ({value: author.id ?? '', label: `${author.firstName} ${author.lastName}`}));
}

/**
 * Opens the edition dialogs of the library settings. Each method resolves with the created or updated entity,
 * or with nothing when the user cancels; the caller decides what to do with it.
 */
@Injectable({providedIn: 'root'})
export class LibraryDialogs {
  private readonly dialog = inject(MatDialog);
  private readonly googleBooks = inject(GoogleBookService);

  async confirmDelete(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open<DeleteModalComponent, {message: string}, boolean>(DeleteModalComponent, {
      height: 'auto',
      width: '600px',
      data: {message},
    });
    return (await firstValueFrom(dialogRef.afterClosed())) === true;
  }

  async editAuthor(parent: DialogParent | undefined, author?: Author): Promise<Author | undefined> {
    const values = await this.openForm({
      title: author ? "Edition d'un auteur" : "Ajout d'un nouvel auteur",
      icon: author ? 'edit' : 'person_add_alt_1',
      titleKeys: author ? ['firstName', 'lastName'] : undefined,
      fields: [
        {key: 'firstName', label: 'Prénom', type: 'text'},
        {key: 'lastName', label: 'Nom', type: 'text'},
        {key: 'resume', label: 'Résumé', type: 'textarea'},
      ],
      values: {firstName: author?.firstName ?? '', lastName: author?.lastName ?? '', resume: author?.resume ?? ''},
    });
    if (!values) {
      return undefined;
    }
    const fields = {firstName: values['firstName'], lastName: values['lastName'], resume: values['resume']};
    return author ? {...author, ...fields} : {...fields, id: uuidv4(), by: parent?.by, parentId: parent?.id};
  }

  async editCategory(library: Library, category?: Category): Promise<Category | undefined> {
    const values = await this.openForm({
      title: category ? 'Edition de la categorie' : "Ajout d'une nouvelle categorie",
      icon: category ? 'edit' : 'add',
      titleKeys: category ? ['name'] : undefined,
      fields: [
        {key: 'name', label: 'Nom', type: 'text'},
        {key: 'resume', label: 'Résumé', type: 'textarea'},
        {key: 'bg', label: 'Visuel', type: 'text'},
        {key: 'prefix', label: 'Prefix', type: 'text'},
      ],
      values: {
        name: category?.name ?? '',
        resume: category?.resume ?? '',
        bg: category?.bg ?? '',
        prefix: category?.prefix ?? '',
      },
    });
    if (!values) {
      return undefined;
    }
    const fields = {name: values['name'], resume: values['resume'], bg: values['bg'], prefix: values['prefix']};
    if (category) {
      return {...category, ...fields};
    }
    return {
      ...fields,
      id: uuidv4(),
      parentId: library.id,
      by: library.by,
      ...(library.by === ViewBy.BY_AUTHOR ? {authors: []} : {series: []}),
    };
  }

  async editPublisher(parent: DialogParent | undefined, publisher?: Publisher): Promise<Publisher | undefined> {
    const values = await this.openForm({
      title: publisher ? "Edition d'un editeur" : "Ajout d'un nouvel editeur",
      icon: publisher ? 'edit' : 'add_business',
      titleKeys: publisher ? ['name'] : undefined,
      fields: [{key: 'name', label: 'Nom', type: 'text'}],
      values: {name: publisher?.name ?? ''},
    });
    if (!values) {
      return undefined;
    }
    return publisher
      ? {...publisher, name: values['name']}
      : {name: values['name'], id: uuidv4(), by: parent?.by, parentId: parent?.id};
  }

  async editSeries(parent: DialogParent | undefined, biblio: Biblio, series?: Series): Promise<Series | undefined> {
    const values = await this.openForm({
      title: series ? 'Edition de la serie' : "Ajout d'une nouvelle serie",
      icon: series ? 'edit' : 'add',
      titleKeys: series ? ['name'] : undefined,
      fields: [
        {key: 'name', label: 'Titre', type: 'text'},
        {key: 'resume', label: 'Résumé', type: 'textarea'},
        {key: 'author', label: 'Auteur', type: 'select', options: authorOptions(biblio)},
        {key: 'status', label: 'Status', type: 'select', options: enumOptions(SeriesStatus)},
      ],
      values: {
        name: series?.name ?? '',
        resume: series?.resume ?? '',
        author: series ? (series.authorIds[0] ?? '') : parent?.by === ViewBy.BY_AUTHOR ? (parent.id ?? '') : '',
        status: series?.status ?? SeriesStatus.NEW,
      },
    });
    if (!values) {
      return undefined;
    }
    const fields = {
      name: values['name'],
      resume: values['resume'],
      authorIds: values['author'] ? [values['author']] : [],
      status: values['status'] as SeriesStatus,
    };
    return series ? {...series, ...fields} : {...fields, id: uuidv4(), by: parent?.by, parentId: parent?.id};
  }

  async editBook(parent: Series | Author | undefined, biblio: Biblio, book?: Book): Promise<Book | undefined> {
    const values = await this.openForm({
      title: book ? 'Edition du livre' : "Ajout d'un nouveau livre",
      icon: book ? 'edit' : 'add',
      titleKeys: book ? ['name'] : undefined,
      fields: this.bookFields(biblio),
      values: book ? this.bookToValues(book) : this.newBookValues(parent),
      cover: {key: 'cover', libraryPath: biblio.library?.path},
      // Both buttons historically trigger the same Google Books lookup.
      extraActions: ['Choisir', 'Chercher'].map(label => ({
        icon: label === 'Choisir' ? 'image' : 'search',
        label,
        run: (form: DialogForm) => this.findBook(form, biblio),
      })),
    });
    if (!values) {
      return undefined;
    }
    const fields = {
      name: values['name'],
      status: values['status'] as BookStatus,
      resume: values['resume'],
      authorIds: values['author'] ? [values['author']] : [],
      isbn10: values['isbn10'],
      isbn13: values['isbn13'],
      format: values['format'],
      page: values['page'],
      publisherId: values['publisher'],
      ref: values['ref'],
      tome: values['tome'],
      date: values['date'],
      year: values['year'],
      cover: values['cover'],
    };
    return book ? {...book, ...fields} : {...fields, id: uuidv4(), by: parent?.by, parentId: parent?.id};
  }

  private bookFields(biblio: Biblio): Array<FormField> {
    return [
      {key: 'name', label: 'Titre', type: 'text'},
      {key: 'resume', label: 'Résumé', type: 'textarea'},
      {key: 'author', label: 'Auteur', type: 'select', options: authorOptions(biblio), half: true},
      {key: 'status', label: 'Status', type: 'select', options: enumOptions(BookStatus), half: true},
      {key: 'tome', label: 'Tome', type: 'text', half: true},
      {key: 'ref', label: 'Référence', type: 'text', half: true},
      {key: 'isbn10', label: 'ISBN10', type: 'text', half: true},
      {key: 'isbn13', label: 'ISBN13', type: 'text', half: true},
      {
        key: 'publisher',
        label: 'Editeur',
        type: 'select',
        half: true,
        options: (biblio.publishers ?? []).map(publisher => ({value: publisher.id ?? '', label: publisher.name})),
      },
      {key: 'date', label: 'Date de publication', type: 'text', half: true},
      {key: 'format', label: 'Format', type: 'text', half: true},
      {key: 'page', label: 'Nombre de page', type: 'text', half: true},
      {key: 'cover', label: 'Couverture', type: 'text', half: true},
      {key: 'year', label: "Année d'achat", type: 'text', half: true},
    ];
  }

  private bookToValues(book: Book): FormValues {
    return {
      name: book.name,
      resume: book.resume,
      author: book.authorIds[0] ?? '',
      status: book.status,
      tome: book.tome,
      ref: book.ref,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      publisher: book.publisherId ?? '',
      date: book.date,
      format: book.format,
      page: book.page,
      cover: book.cover,
      year: book.year,
    };
  }

  private newBookValues(parent?: Series | Author): FormValues {
    let author = '';
    let tome = '';
    if (parent && isSeries(parent)) {
      author = parent.status === SeriesStatus.ONE_SHOT ? '' : (parent.authorIds[0] ?? '');
      tome = parent.status === SeriesStatus.IN_PROGRESS && parent.books ? String(parent.books.length + 1) : '';
    } else if (parent) {
      author = parent.id ?? '';
    }
    return {
      name: '',
      resume: '',
      author,
      status: BookStatus.IN_PROJECT,
      tome,
      ref: '',
      isbn10: '',
      isbn13: '',
      publisher: '',
      date: '',
      format: '',
      page: '',
      cover: NO_COVER,
      year: String(new Date().getFullYear()),
    };
  }

  /** Looks the book up on Google Books and lets the user pick which result fills the form. */
  private async findBook(form: DialogForm, biblio: Biblio): Promise<void> {
    const {isbn13, name} = form.getRawValue();
    const search = isbn13
      ? {by: `isbn: ${isbn13}`, results: this.googleBooks.searchByIsbn(isbn13)}
      : name
        ? {by: `titre: ${name}`, results: this.googleBooks.searchByTitle(name)}
        : undefined;
    if (!search) {
      return;
    }
    const results = await firstValueFrom(search.results);
    if (!results.length) {
      return;
    }
    const dialogRef = this.dialog.open<SearchModalComponent, unknown, SearchBookResult>(SearchModalComponent, {
      height: '780px',
      width: '1200px',
      data: {by: search.by, searchResults: results},
    });
    const selected = await firstValueFrom(dialogRef.afterClosed());
    if (!selected) {
      return;
    }
    const tokens = selected.authors.trim().split(' ');
    const firstName = tokens[tokens.length - 1];
    const lastName = tokens.slice(0, -1).join(' ');
    const author = biblio.authors?.find(
      candidate =>
        (candidate.firstName === firstName && candidate.lastName === lastName) ||
        (candidate.firstName === lastName && candidate.lastName === firstName)
    );
    const publisher = selected.publisher
      ? biblio.publishers?.find(candidate => candidate.name === selected.publisher.trim())
      : undefined;
    const cover = form.controls['cover'].value;
    form.patchValue({
      name: selected.title,
      resume: selected.resume,
      isbn10: selected.isbn10,
      isbn13: selected.isbn13,
      author: author?.id ?? '',
      publisher: publisher?.id ?? '',
      date: selected.publishedDate,
      page: selected.page,
      cover: cover === NO_COVER || cover === '' ? `${selected.isbn13}.jpg` : cover,
    });
  }

  private openForm(data: FormDialogData): Promise<FormValues | undefined> {
    const dialogRef = this.dialog.open<FormDialogComponent, FormDialogData, FormValues>(FormDialogComponent, {
      height: 'auto',
      width: DIALOG_WIDTH,
      data,
    });
    return firstValueFrom(dialogRef.afterClosed());
  }
}
