import {Biblio, Book, BookStatus, ViewBy} from '../../models/author.model';
import {authorNames, publisherName} from './library-queries';
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
});
