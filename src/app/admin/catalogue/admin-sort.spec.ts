import {AdminItem} from './admin-collection.model';
import {AdminRow, nextSort, sortRows} from './admin-sort';

const row = (name: string, extra: Partial<AdminItem> = {}, labels: Partial<AdminRow> = {}): AdminRow => ({
  item: {key: name, id: name, collectionId: 'c', name, source: {id: name, name}, ...extra},
  collectionLabel: '',
  categoryLabel: '',
  statusLabel: '',
  ...labels,
});

describe('sortRows', () => {
  const names = (rows: AdminRow[]) => rows.map(candidate => candidate.item.name);

  it('leaves the rows as they are without a sort', () => {
    const rows = [row('b'), row('a')];
    expect(names(sortRows(rows, null))).toEqual(['b', 'a']);
  });

  it('sorts by name in both directions, ignoring case and accents', () => {
    const rows = [row('zèbre'), row('Abeille'), row('éléphant')];
    expect(names(sortRows(rows, {column: 'name', direction: 'asc'}))).toEqual(['Abeille', 'éléphant', 'zèbre']);
    expect(names(sortRows(rows, {column: 'name', direction: 'desc'}))).toEqual(['zèbre', 'éléphant', 'Abeille']);
  });

  it('sorts references by number, not by text', () => {
    const rows = [row('a', {ref: 'ludo342'}), row('b', {ref: 'ludo96'}), row('c', {ref: 'ludo1000'})];
    expect(names(sortRows(rows, {column: 'ref', direction: 'asc'}))).toEqual(['b', 'a', 'c']);
  });

  it('keeps the rows without a value last, in both directions', () => {
    const rows = [row('a'), row('b', {ref: 'x2'}), row('c', {ref: 'x10'})];
    expect(names(sortRows(rows, {column: 'ref', direction: 'asc'}))).toEqual(['b', 'c', 'a']);
    expect(names(sortRows(rows, {column: 'ref', direction: 'desc'}))).toEqual(['c', 'b', 'a']);
  });

  it('sorts by the labels the rows are shown with', () => {
    const rows = [row('a', {}, {categoryLabel: 'Wii'}), row('b', {}, {categoryLabel: 'Nintendo DS'})];
    expect(names(sortRows(rows, {column: 'category', direction: 'asc'}))).toEqual(['b', 'a']);
  });

  it('puts the items without a cover first or last', () => {
    const rows = [row('with', {cover: 'x.jpg'}), row('without')];
    expect(names(sortRows(rows, {column: 'cover', direction: 'asc'}))).toEqual(['without', 'with']);
    expect(names(sortRows(rows, {column: 'cover', direction: 'desc'}))).toEqual(['with', 'without']);
  });

  it('does not change the rows it is given', () => {
    const rows = [row('b'), row('a')];
    sortRows(rows, {column: 'name', direction: 'asc'});
    expect(names(rows)).toEqual(['b', 'a']);
  });
});

describe('nextSort', () => {
  it('goes ascending, descending, then back to the default order', () => {
    const first = nextSort(null, 'name');
    const second = nextSort(first, 'name');
    expect(first).toEqual({column: 'name', direction: 'asc'});
    expect(second).toEqual({column: 'name', direction: 'desc'});
    expect(nextSort(second, 'name')).toBeNull();
  });

  it('starts again ascending on another column', () => {
    expect(nextSort({column: 'name', direction: 'desc'}, 'ref')).toEqual({column: 'ref', direction: 'asc'});
  });
});
