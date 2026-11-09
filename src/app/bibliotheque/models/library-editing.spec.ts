import {Biblio, Book, BookStatus, Category, Series, SeriesStatus, ViewBy} from '../../models/author.model';
import {removeBook, saveBook, saveCategory, saveSeries} from './library-editing';

function book(id: string, name = id): Book {
  return {
    id, name, by: ViewBy.BY_SERIES, status: BookStatus.AVAILABLE, resume: '', authorIds: [], isbn10: '', isbn13: '',
    cover: '', format: '', page: '', publisherId: '', ref: '', tome: '', date: '', year: '',
  };
}

function createLibrary(): Biblio {
  const series: Series = {id: 'series', name: 'Series', by: ViewBy.BY_SERIES, authorIds: [], status: SeriesStatus.NEW, resume: '', books: [book('one')]};
  const category: Category = {id: 'category', name: 'Category', prefix: '', resume: '', by: ViewBy.BY_SERIES, series: [series]};
  return {library: {id: 'library', name: 'Library', by: ViewBy.BY_SERIES, prefix: '', resume: '', categories: [category]}};
}

describe('library editing', () => {
  it('adds a book without mutating the source library', () => {
    const library = createLibrary();
    const updated = saveBook(library, {categoryId: 'category', seriesId: 'series'}, book('two'));

    expect(updated.library.categories?.[0].series?.[0].books?.map(item => item.id)).toEqual(['one', 'two']);
    expect(library.library.categories?.[0].series?.[0].books?.length).toBe(1);
  });

  it('replaces an existing book with the same id', () => {
    const updated = saveBook(createLibrary(), {categoryId: 'category', seriesId: 'series'}, book('one', 'Renamed'));

    expect(updated.library.categories?.[0].series?.[0].books?.map(item => item.name)).toEqual(['Renamed']);
  });

  it('removes a book', () => {
    const updated = removeBook(createLibrary(), {categoryId: 'category', seriesId: 'series'}, 'one');

    expect(updated.library.categories?.[0].series?.[0].books).toEqual([]);
  });

  it('adds a series and a category', () => {
    const library = createLibrary();
    const series: Series = {id: 'other', name: 'Other', by: ViewBy.BY_SERIES, authorIds: [], status: SeriesStatus.NEW, resume: ''};
    const withSeries = saveSeries(library, {categoryId: 'category'}, series);
    const withCategory = saveCategory(withSeries, {id: 'second', name: 'Second', prefix: '', resume: '', by: ViewBy.BY_SERIES});

    expect(withSeries.library.categories?.[0].series?.length).toBe(2);
    expect(withCategory.library.categories?.length).toBe(2);
  });
});
