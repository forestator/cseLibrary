import {Biblio, Book, BookStatus, Category, ViewBy} from '../../models/author.model';
import {authorNames, categoryBooks, countLabel, publisherName, visibleBookCount} from './library-queries';
import {filterBooks} from './library-visibility';

const biblio: Biblio = {
  library: {id: 'library', name: 'Library', by: ViewBy.BY_SERIES, prefix: '', resume: ''},
  authors: [
    {id: 'a1', firstName: 'Ursula', lastName: 'Le Guin'},
    {id: 'a2', firstName: 'Isaac', lastName: 'Asimov'},
  ],
  publishers: [{id: 'p1', name: 'Gallimard'}],
};

describe('library queries', () => {
  it('joins the names of the known authors', () => {
    expect(authorNames(['a1', undefined, 'unknown', 'a2'], biblio)).toBe('Ursula Le Guin, Isaac Asimov');
  });

  it('resolves a publisher name, or an empty string', () => {
    expect(publisherName('p1', biblio)).toBe('Gallimard');
    expect(publisherName('missing', biblio)).toBe('');
    expect(publisherName(undefined, biblio)).toBe('');
  });

  it('hides declassed and missing books outside the admin mode', () => {
    const books = [BookStatus.AVAILABLE, BookStatus.DECLASSED, BookStatus.MISSING, BookStatus.NEW].map(status => ({
      status,
    }));

    const visible = filterBooks(books as Array<Book>, false).map(book => book.status);

    expect(visible).toEqual([BookStatus.AVAILABLE, BookStatus.NEW]);
    expect(filterBooks(books as Array<Book>, true).length).toBe(4);
  });

  it('pluralizes a count label', () => {
    expect(countLabel(0, 'livre')).toBe('0 livre');
    expect(countLabel(1, 'livre')).toBe('1 livre');
    expect(countLabel(2, 'livre')).toBe('2 livres');
  });

  it('counts the books of a category once, under series and authors, hiding the declassed ones', () => {
    const shared = {id: 'b1', status: BookStatus.AVAILABLE} as Book;
    const declassed = {id: 'b2', status: BookStatus.DECLASSED} as Book;
    const alone = {id: 'b3', status: BookStatus.NEW} as Book;
    const category = {
      series: [{books: [shared, declassed]}],
      authors: [{books: [shared, alone], series: []}],
    } as unknown as Category;

    expect(categoryBooks(category).length).toBe(3);
    expect(visibleBookCount([category], false)).toBe(2);
    expect(visibleBookCount([category], true)).toBe(3);
  });
});
