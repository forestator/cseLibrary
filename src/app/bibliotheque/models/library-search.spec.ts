import {Biblio, Book, BookStatus, Series, SeriesStatus, ViewBy} from '../../models/author.model';
import {buildSearchIndex, normalizeText, searchBooks} from './library-search';

function book(id: string, name: string, extra: Partial<Book> = {}): Book {
  return {id, name, status: BookStatus.AVAILABLE, authorIds: [], isbn10: '', isbn13: '', tome: '', ...extra} as Book;
}

function series(id: string, name: string, books: Array<Book>): Series {
  return {id, name, books, status: SeriesStatus.IN_PROGRESS, authorIds: []} as Series;
}

const biblio: Biblio = {
  authors: [
    {id: 'hugo', firstName: 'Victor', lastName: 'Hugo'},
    {id: 'zola', firstName: 'Émile', lastName: 'Zola'},
  ],
  library: {
    id: 'lib', name: 'Littérature', by: ViewBy.BY_SERIES, prefix: '', resume: '', path: 'lib',
    categories: [
      {
        id: 'cat', name: 'Romans', prefix: '', resume: '', by: ViewBy.BY_SERIES,
        series: [
          series('hobbit', 'Le Seigneur des Anneaux', [
            book('b1', 'La Communauté de l’Anneau', {tome: '1', authorIds: ['hugo'], isbn13: '978-2-07-061332-5', isbn10: '2070613321'}),
            book('b2', 'Les Deux Tours', {tome: '2'}),
            book('b3', 'Le Retour du roi', {status: BookStatus.DECLASSED}),
            book('b4', 'Séparateur', {status: BookStatus.SEPARATOR}),
          ]),
          series('misc', 'Divers', [book('b5', 'Anneau de Feu', {authorIds: ['zola']})]),
        ],
      },
      {
        id: 'auth', name: 'Classiques', prefix: '', resume: '', by: ViewBy.BY_AUTHOR,
        authors: [
          {id: 'zola', firstName: 'Émile', lastName: 'Zola', by: ViewBy.BY_AUTHOR, books: [book('b6', 'Germinal')], series: [series('rougon', 'Les Rougon-Macquart', [book('b7', 'La Bête humaine')])]},
        ],
      },
    ],
  },
};

describe('library search', () => {
  const index = buildSearchIndex([biblio], false);
  const titles = (query: string) => searchBooks(index, query).map(entry => entry.book.name);

  it('normalizes accents, case and punctuation', () => {
    expect(normalizeText('  Œuvre d’Émile-Zola ')).toBe('oeuvre d emile zola');
  });

  it('indexes only visible books outside the admin mode, never separators', () => {
    expect(index.map(entry => entry.book.id)).toEqual(['b1', 'b2', 'b5', 'b6', 'b7']);
    expect(buildSearchIndex([biblio], true).map(entry => entry.book.id)).toContain('b3');
    expect(buildSearchIndex([biblio], true).map(entry => entry.book.id)).not.toContain('b4');
  });

  it('finds a book by title ignoring case and accents', () => {
    expect(titles('communaute')).toEqual(['La Communauté de l’Anneau']);
    expect(titles('BETE HUMAINE')).toEqual(['La Bête humaine']);
  });

  it('finds the books of a series by its name', () => {
    expect(titles('seigneur anneaux')).toEqual(['La Communauté de l’Anneau', 'Les Deux Tours']);
  });

  it('finds books by author name, also when the book hangs under the author', () => {
    expect(titles('zola')).toEqual(['Anneau de Feu', 'Germinal', 'La Bête humaine']);
    expect(titles('emile zola germinal')).toEqual(['Germinal']);
  });

  it('requires every typed word to match', () => {
    expect(titles('anneau hugo')).toEqual(['La Communauté de l’Anneau']);
    expect(titles('anneau inconnu')).toEqual([]);
  });

  it('finds a book by ISBN 13 (with or without hyphens) and ISBN 10', () => {
    expect(titles('978-2-07-061332-5')).toEqual(['La Communauté de l’Anneau']);
    expect(titles('9782070613325')).toEqual(['La Communauté de l’Anneau']);
    expect(titles('2070613321')).toEqual(['La Communauté de l’Anneau']);
  });

  it('ranks words starting a title before plain substrings and exact titles first', () => {
    expect(titles('anneau')[0]).toBe('Anneau de Feu');
    expect(titles('germinal')).toEqual(['Germinal']);
  });

  it('returns nothing for an empty query and honours the limit', () => {
    expect(searchBooks(index, '   ')).toEqual([]);
    expect(searchBooks(index, 'e', 2).length).toBe(2);
  });

  it('keeps the location of a book: series, or author for author categories', () => {
    const byId = (id: string) => index.find(entry => entry.book.id === id);
    expect(byId('b1')?.series?.id).toBe('hobbit');
    expect(byId('b1')?.authorId).toBeUndefined();
    expect(byId('b6')?.authorId).toBe('zola');
    expect(byId('b7')?.authorId).toBe('zola');
  });
});
