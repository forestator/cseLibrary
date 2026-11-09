import {computed, signal, WritableSignal} from '@angular/core';
import {Author, Biblio, Book, Category, Publisher, Series, SeriesStatus, ViewBy} from '../../../models/author.model';
import {
  BookLocation,
  removeAuthor,
  removeBook,
  removeCategory,
  removePublisher,
  removeSeries,
  saveAuthor,
  saveBook,
  saveCategory,
  savePublisher,
  saveSeries,
  SeriesLocation,
} from '../../models/library-editing';
import {authorNames, publisherName} from '../../models/library-queries';
import {LibraryDialogs} from '../../services/library-dialogs.service';
import {SettingsNode, SettingsNodeAction, SettingsNodeField, SettingsSelection, SettingsTile} from './settings-node.model';

function field(label: string, value?: string): SettingsNodeField {
  return {label, value};
}

function hasText(value?: string): boolean {
  return !!value?.length;
}

/**
 * Edition logic of the library settings: builds the tree displayed by the generic panels and applies the
 * edits to a working copy. Changes stay in memory; nothing is written back to the database.
 */
export class LibraryEditor {
  readonly selection = signal<SettingsSelection | undefined>(undefined);

  /** Header panel of the library: its description and the buttons creating categories, authors and publishers. */
  readonly libraryNode = computed<SettingsNode | undefined>(() => {
    const biblio = this.biblio();
    if (!biblio) {
      return undefined;
    }
    const library = biblio.library;
    const actions: Array<SettingsNodeAction> = [
      {
        icon: 'add',
        label: 'Ajouter une nouvelle catégorie',
        tone: 'add',
        run: async () => {
          const category = await this.dialogs.editCategory(library);
          if (category) {
            this.apply(current => saveCategory(current, category));
          }
        },
      },
    ];
    if (library.by === ViewBy.BY_SERIES) {
      actions.push(
        {
          icon: 'person_add_alt_1',
          label: 'Ajouter un nouvel auteur',
          tone: 'add',
          run: async () => {
            const author = await this.dialogs.editAuthor(library);
            if (author) {
              this.apply(current => saveAuthor(current, author));
            }
          },
        },
        {
          icon: 'add_business',
          label: 'Ajouter un nouvel editeur',
          tone: 'add',
          run: async () => {
            const publisher = await this.dialogs.editPublisher(library);
            if (publisher) {
              this.apply(current => savePublisher(current, publisher));
            }
          },
        }
      );
    }
    const fields = [field('Nom', library.name)];
    if (hasText(library.resume)) {
      fields.push(field('Résumé', library.resume));
    }
    return {id: library.id ?? '', title: library.name, expanded: true, fields, actions, children: []};
  });

  /** Sections that can be opened under the library description. */
  readonly tiles = computed<Array<SettingsTile>>(() => {
    const biblio = this.biblio();
    if (!biblio) {
      return [];
    }
    const tiles: Array<SettingsTile> = (biblio.library.categories ?? []).map(category => ({
      key: `category-${category.id}`,
      title: category.name,
      info:
        category.by === ViewBy.BY_SERIES
          ? `${category.series?.length ?? 0} séries`
          : category.by === ViewBy.BY_AUTHOR
            ? `${category.authors?.length ?? 0} auteurs`
            : '',
      selection: {kind: 'category', id: category.id},
    }));
    if (biblio.library.by === ViewBy.BY_SERIES) {
      tiles.push({key: 'authors', title: 'Auteur', info: `${biblio.authors?.length ?? 0} auteurs`, selection: {kind: 'authors'}});
    }
    tiles.push({key: 'publishers', title: 'Editeur', info: `${biblio.publishers?.length ?? 0} editeurs`, selection: {kind: 'publishers'}});
    return tiles;
  });

  readonly selectedKey = computed(() => {
    const selection = this.selection();
    return selection?.kind === 'category' ? `category-${selection.id}` : selection?.kind;
  });

  /** Top level entries of the selected section: one category, or the authors or the publishers. */
  readonly selectedNodes = computed<Array<SettingsNode>>(() => {
    const biblio = this.biblio();
    const selection = this.selection();
    if (!biblio || !selection) {
      return [];
    }
    switch (selection.kind) {
      case 'category': {
        const category = biblio.library.categories?.find(candidate => candidate.id === selection.id);
        return category ? [this.categoryNode(biblio, category)] : [];
      }
      case 'authors':
        return (biblio.authors ?? []).map((author, index) => this.authorNode(biblio, author, `1_${index + 1}`));
      case 'publishers':
        return (biblio.publishers ?? []).map((publisher, index) => this.publisherNode(publisher, `1_${index + 1}`));
    }
  });

  constructor(
    private readonly biblio: WritableSignal<Biblio | undefined>,
    private readonly dialogs: LibraryDialogs
  ) {}

  private apply(change: (biblio: Biblio) => Biblio): void {
    this.biblio.update(current => current && change(current));
  }

  private categoryNode(biblio: Biblio, category: Category): SettingsNode {
    const isBySeries = category.by === ViewBy.BY_SERIES;
    const children = isBySeries
      ? (category.series ?? []).map((series, index) =>
          this.seriesNode(biblio, series, `1_${index + 1}`, {categoryId: category.id ?? ''}))
      : category.by === ViewBy.BY_AUTHOR
        ? (category.authors ?? []).map((author, index) =>
            this.authorNode(biblio, author, `1_${index + 1}`, category.id))
        : [];
    const actions: Array<SettingsNodeAction> = [
      this.editAction(async () => {
        const updated = await this.dialogs.editCategory(biblio.library, category);
        if (updated) {
          this.apply(current => saveCategory(current, updated));
        }
      }),
      this.deleteAction(`Voulez vous vraiment supprimer cette categorie: ${category.name}`, () =>
        this.apply(current => removeCategory(current, category.id))),
    ];
    if (isBySeries) {
      actions.push({
        icon: 'add',
        label: 'Ajouter une nouvelle serie',
        tone: 'add',
        run: async () => {
          const series = await this.dialogs.editSeries(category, biblio);
          if (series) {
            this.apply(current => saveSeries(current, {categoryId: category.id ?? ''}, series));
          }
        },
      });
    } else if (category.by === ViewBy.BY_AUTHOR) {
      actions.push({
        icon: 'person_add_alt_1',
        label: 'Ajouter un nouvel auteur',
        tone: 'add',
        run: async () => {
          const author = await this.dialogs.editAuthor(category);
          if (author) {
            this.apply(current => saveAuthor(current, author, category.id));
          }
        },
      });
    }
    const fields = [field('Nom', category.name)];
    if (hasText(category.resume)) {
      fields.push(field('Résumé', category.resume));
    }
    fields.push(field('Visuel', category.bg), field('Prefix', category.prefix));
    return {id: category.id ?? '', title: `#1: ${category.name}`, expanded: true, fields, actions, children};
  }

  private authorNode(biblio: Biblio, author: Author, index: string, categoryId?: string): SettingsNode {
    const fullName = `${author.lastName} ${author.firstName}`;
    const actions: Array<SettingsNodeAction> = [
      this.editAction(async () => {
        const updated = await this.dialogs.editAuthor(undefined, author);
        if (updated) {
          this.apply(current => saveAuthor(current, updated, categoryId));
        }
      }),
      this.deleteAction(
        `Voulez vous vraiment supprimer cet auteur: ${author.firstName} ${author.lastName}`,
        () => this.apply(current => removeAuthor(current, author.id, categoryId))
      ),
    ];
    const children: Array<SettingsNode> = [];
    if (categoryId) {
      const location: SeriesLocation = {categoryId, authorId: author.id};
      children.push(
        ...(author.books ?? []).map((book, bookIndex) =>
          this.bookNode(biblio, book, `${index}_${bookIndex + 1}`, location)),
        ...(author.series ?? []).map((series, seriesIndex) =>
          this.seriesNode(biblio, series, `${index}_${seriesIndex + 1}`, location))
      );
    }
    if (categoryId && author.by === ViewBy.BY_AUTHOR) {
      const location: SeriesLocation = {categoryId, authorId: author.id};
      actions.push(
        {
          icon: 'add',
          label: 'Ajouter un nouveau livre',
          tone: 'add',
          run: async () => {
            const book = await this.dialogs.editBook(author, biblio);
            if (book) {
              this.apply(current => saveBook(current, location, book));
            }
          },
        },
        {
          icon: 'add_box',
          label: 'Ajouter une nouvelle serie',
          tone: 'add',
          run: async () => {
            const series = await this.dialogs.editSeries(author, biblio);
            if (series) {
              this.apply(current => saveSeries(current, location, series));
            }
          },
        }
      );
    }
    const fields = [field('Nom', fullName)];
    if (hasText(author.resume)) {
      fields.push(field('Résumé', author.resume));
    }
    return {id: author.id ?? '', title: `#${index}: ${fullName}`, fields, actions, children};
  }

  private seriesNode(biblio: Biblio, series: Series, index: string, location: SeriesLocation): SettingsNode {
    const bookLocation: BookLocation = {...location, seriesId: series.id};
    const fields = [field('Nom', series.name)];
    if (hasText(series.resume)) {
      fields.push(field('Résumé', series.resume));
    }
    if (series.by === ViewBy.BY_SERIES && series.status !== SeriesStatus.ONE_SHOT) {
      fields.push(field('Auteur(s)', authorNames(series.authorIds, biblio)));
    }
    fields.push({label: 'Status', series});
    return {
      id: series.id ?? '',
      title: `#${index}: ${series.name}`,
      fields,
      actions: [
        this.editAction(async () => {
          const updated = await this.dialogs.editSeries(undefined, biblio, series);
          if (updated) {
            this.apply(current => saveSeries(current, location, updated));
          }
        }),
        this.deleteAction(`Voulez vous vraiment supprimer cette serie: ${series.name}`, () =>
          this.apply(current => removeSeries(current, location, series.id))),
        {
          icon: 'add',
          label: 'Ajouter un nouveau livre',
          tone: 'add',
          run: async () => {
            const book = await this.dialogs.editBook(series, biblio);
            if (book) {
              this.apply(current => saveBook(current, bookLocation, book));
            }
          },
        },
      ],
      children: (series.books ?? []).map((book, bookIndex) =>
        this.bookNode(biblio, book, `${index}_${bookIndex + 1}`, bookLocation)),
    };
  }

  private bookNode(biblio: Biblio, book: Book, index: string, location: BookLocation): SettingsNode {
    const fields = [field('Nom', book.name)];
    if (hasText(book.resume)) {
      fields.push(field('Résumé', book.resume));
    }
    if (book.by === ViewBy.BY_SERIES) {
      fields.push(field('Auteur(s)', authorNames(book.authorIds, biblio)));
    }
    if (book.tome !== '0') {
      fields.push(field('Tome', book.tome));
    }
    fields.push(
      field('Editeur', publisherName(book.publisherId, biblio)),
      {label: 'Status', bookStatus: book.status},
      field('ISBN', `${book.isbn10} | ${book.isbn13}`),
      field('BIBLICE', `${book.biblice?.codeBarre ?? ''} | ${book.biblice?.codeAccess ?? ''}`),
      field("Année d'achat", book.year),
      field('Référence', book.ref)
    );
    return {
      id: book.id ?? '',
      title: `#${index}: ${book.name}`,
      bookStatus: book.status,
      fields,
      actions: [
        this.editAction(async () => {
          const updated = await this.dialogs.editBook(undefined, biblio, book);
          if (updated) {
            this.apply(current => saveBook(current, location, updated));
          }
        }),
        this.deleteAction(`Voulez vous vraiment supprimer ce livre: ${book.name} ?`, () =>
          this.apply(current => removeBook(current, location, book.id))),
      ],
      children: [],
    };
  }

  private publisherNode(publisher: Publisher, index: string): SettingsNode {
    return {
      id: publisher.id ?? '',
      title: `#${index}: ${publisher.name}`,
      fields: [field('Nom', publisher.name)],
      actions: [
        this.editAction(async () => {
          const updated = await this.dialogs.editPublisher(undefined, publisher);
          if (updated) {
            this.apply(current => savePublisher(current, updated));
          }
        }),
        this.deleteAction(`Voulez vous vraiment supprimer cet editeur: ${publisher.name}`, () =>
          this.apply(current => removePublisher(current, publisher.id))),
      ],
      children: [],
    };
  }

  private editAction(run: () => void): SettingsNodeAction {
    return {icon: 'edit', label: 'Modifier', tone: 'edit', run};
  }

  private deleteAction(message: string, onConfirm: () => void): SettingsNodeAction {
    return {
      icon: 'delete',
      label: 'Supprimer',
      tone: 'delete',
      run: async () => {
        if (await this.dialogs.confirmDelete(message)) {
          onConfirm();
        }
      },
    };
  }
}
