import {Biblio, Book, BookStatus, Category, ViewBy} from '../../models/author.model';
import {
  BookTarget, bookKey, findAuthorId, findBook, flattenBooks, hasBook, insertBook, removeBooks, replaceBook, setBooksStatus, splitPersonName,
} from './library-books';

const book = (name: string, extra: Partial<Book> = {}): Book => ({
  id: name, name, by: undefined, status: BookStatus.AVAILABLE, resume: '', authorIds: [], isbn10: '', isbn13: '', cover: '',
  format: '', page: '', publisherId: undefined, ref: 'R-ADL', tome: '', date: '', year: '', ...extra,
});

const byAuthor = (): Category => ({
  id: 'cat-author', name: 'Romans', prefix: 'R', resume: '', by: ViewBy.BY_AUTHOR,
  authors: [
    {id: 'a1', firstName: 'Elizabeth', lastName: 'Adler', books: [book('Une maison à Amalfi'), book('Sans titre', {id: undefined})]},
    {id: 'a2', firstName: 'Jean', lastName: 'Giono', books: [book('Colline')]},
  ],
});

const bySeries = (): Category => ({
  id: 'cat-series', name: 'Fantasy', prefix: 'FY', resume: '', by: ViewBy.BY_SERIES,
  series: [{id: 's1', name: 'Divers', by: ViewBy.BY_SERIES, authorIds: ['a1'], status: 'IN_PROGRESS' as never, resume: '', books: [book('Légende')]}],
});

const target = (overrides: Partial<BookTarget> = {}): BookTarget => ({authorId: 'a1', firstName: 'Elizabeth', lastName: 'Adler', seriesName: 'Divers', ...overrides});
const names = (category: Category) => flattenBooks({library: {id: 'l', name: 'L', by: ViewBy.BY_AUTHOR, prefix: '', resume: '', categories: [category]}} as Biblio).map(entry => entry.book.name);

describe('flattenBooks', () => {
  it('lists the books of both shapes and skips the separators', () => {
    const separator = book('---', {status: BookStatus.SEPARATOR});
    const category = {...byAuthor(), authors: [{...byAuthor().authors![0], books: [book('A'), separator]}]};
    expect(names(category)).toEqual(['A']);
    expect(names(bySeries())).toEqual(['Légende']);
  });

  it('keys a book by its id, and one without id by its place', () => {
    const entries = flattenBooks({library: {id: 'l', name: 'L', by: ViewBy.BY_AUTHOR, prefix: '', resume: '', categories: [byAuthor()]}} as Biblio);
    expect(bookKey(entries[0].locator)).toBe('Une maison à Amalfi');
    expect(bookKey(entries[1].locator)).toBe('cat-author/a1/1');
  });
});

describe('removeBooks, replaceBook and setBooksStatus', () => {
  it('removes a book by id, and the author left with nothing', () => {
    const removed = removeBooks(byAuthor(), [{categoryId: 'cat-author', id: 'Colline', containerId: 'a2', position: 0}]);
    expect(names(removed)).toEqual(['Une maison à Amalfi', 'Sans titre']);
    expect(removed.authors!.map(author => author.id)).toEqual(['a1']);
  });

  it('finds a book without id by its place, not another book', () => {
    const locator = {categoryId: 'cat-author', containerId: 'a1', position: 1};
    expect(hasBook(byAuthor(), locator)).toBeTrue();
    expect(names(removeBooks(byAuthor(), [locator]))).toEqual(['Une maison à Amalfi', 'Colline']);
  });

  it('replaces one book and leaves the others untouched, whatever their cote', () => {
    const replaced = replaceBook(byAuthor(), {categoryId: 'cat-author', id: 'Colline', position: 0}, book('Colline', {name: 'Colline (réédité)'}));
    expect(names(replaced)).toEqual(['Une maison à Amalfi', 'Sans titre', 'Colline (réédité)']);
  });

  it('changes the status of the chosen books only', () => {
    const changed = setBooksStatus(byAuthor(), [{categoryId: 'cat-author', id: 'Colline', position: 0}], BookStatus.MISSING);
    expect(findBook(changed, {categoryId: 'cat-author', id: 'Colline', position: 0})?.status).toBe(BookStatus.MISSING);
    expect(findBook(changed, {categoryId: 'cat-author', id: 'Une maison à Amalfi', position: 0})?.status).toBe(BookStatus.AVAILABLE);
  });

  it('does not touch the category it is given', () => {
    const category = byAuthor();
    removeBooks(category, [{categoryId: 'cat-author', id: 'Colline', position: 0}]);
    expect(names(category)).toContain('Colline');
  });
});

describe('insertBook', () => {
  const newId = () => 'new-id';

  it('adds a book under an existing author of a by-author category, with the series id of the author', () => {
    const inserted = insertBook(byAuthor(), book('Nouveau'), target(), newId);
    const author = inserted.authors!.find(candidate => candidate.id === 'a1')!;
    expect(author.books!.map(candidate => candidate.name)).toContain('Nouveau');
    expect((author.books!.find(candidate => candidate.name === 'Nouveau') as Book & {seriesId?: string}).seriesId).toBe('a1');
  });

  it('creates the author entry, carrying the category id, when it is new to the category', () => {
    const inserted = insertBook(byAuthor(), book('Nouveau'), target({authorId: 'a3', firstName: 'Anne', lastName: 'Nouvelle'}), newId);
    const author = inserted.authors!.find(candidate => candidate.id === 'a3')!;
    expect(author).toEqual(jasmine.objectContaining({firstName: 'Anne', lastName: 'Nouvelle', categoryId: 'cat-author'}));
  });

  it('adds a book to the named series of a by-series category and keeps the author in the series', () => {
    const inserted = insertBook(bySeries(), book('Nouveau'), target({authorId: 'a9'}), newId);
    expect(inserted.series).toHaveSize(1);
    expect(inserted.series![0].authorIds).toEqual(['a1', 'a9']);
    expect(inserted.series![0].books!.map(candidate => candidate.name)).toEqual(['Légende', 'Nouveau']);
    expect(inserted.series![0].books![1].parentId).toBe('s1');
  });

  it('creates the series when it does not exist', () => {
    const inserted = insertBook(bySeries(), book('Nouveau'), target({seriesName: 'Autre'}), newId);
    expect(inserted.series!.map(series => series.name)).toEqual(['Divers', 'Autre']);
    expect(inserted.series![1].id).toBe('new-id');
  });
});

describe('findAuthorId and splitPersonName', () => {
  const authors = [{id: 'a1', firstName: 'Elizabeth', lastName: 'Adler'}, {id: 'a2', firstName: 'ADLER', lastName: 'Olsen Jussi'}];

  it('matches a name in any order, ignoring case and accents', () => {
    expect(findAuthorId(authors, 'adler élizabeth')).toBe('a1');
    expect(findAuthorId(authors, 'Elizabeth Adler')).toBe('a1');
  });

  it('does not match a name that only shares a word', () => {
    expect(findAuthorId(authors, 'Adler')).toBeUndefined();
    expect(findAuthorId(authors, '')).toBeUndefined();
  });

  it('takes the last word as the last name', () => {
    expect(splitPersonName('Jean-Paul Sartre')).toEqual({firstName: 'Jean-Paul', lastName: 'Sartre'});
    expect(splitPersonName('Colette')).toEqual({firstName: '', lastName: 'Colette'});
  });
});
