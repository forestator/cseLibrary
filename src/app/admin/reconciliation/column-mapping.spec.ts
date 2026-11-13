import {guessColumns, missingFields, toRecords} from './column-mapping';

const SOFTWARE_HEADER = ['ob_codebar', 'th_code', 'ov_titre', 'ov_stitre', 'ov_nomaut', 'ov_cotedewey', 'ov_annee', 'ov_id', ''];

describe('guessColumns', () => {
  it('recognises the export of the management software', () => {
    const guess = guessColumns([SOFTWARE_HEADER, ['x']]);
    expect(guess).toEqual({headerRow: 0, mapping: {barcode: 0, type: 1, title: 2, subtitle: 3, author: 4, cote: 5, year: 6, id: 7}});
  });

  it('recognises hand-made headers whatever their case, accents and order', () => {
    const guess = guessColumns([['Titre', 'Auteur', 'Année', 'Cote', 'EAN']]);
    expect(guess?.mapping).toEqual({title: 0, author: 1, year: 2, cote: 3, barcode: 4});
  });

  it('skips a title or blank lines before the header', () => {
    const guess = guessColumns([['Catalogue de novembre'], [''], ['Code-barres', 'Titre', 'Type']]);
    expect(guess).toEqual({headerRow: 2, mapping: {barcode: 0, title: 1, type: 2}});
  });

  it('gives up when no column name is known', () => {
    expect(guessColumns([['foo', 'bar'], ['1', '2']])).toBeNull();
  });

  it('does not use one column for two fields', () => {
    const guess = guessColumns([['Référence', 'Cote', 'Titre']]);
    expect(guess?.mapping.cote).not.toBe(guess?.mapping.id);
    expect(Object.values(guess!.mapping)).toHaveSize(new Set(Object.values(guess!.mapping)).size);
  });
});

describe('missingFields', () => {
  it('needs a title, and a type or a cote', () => {
    expect(missingFields({title: 0, type: 1})).toEqual([]);
    expect(missingFields({title: 0, cote: 2})).toEqual([]);
    expect(missingFields({title: 0})).toEqual(['type']);
    expect(missingFields({type: 1})).toEqual(['title']);
  });
});

describe('toRecords', () => {
  const mapping = {barcode: 0, type: 1, title: 2, id: 3};

  it('turns the rows after the header into records with their line in the file', () => {
    const records = toRecords([SOFTWARE_HEADER, ['0000000000228', 'MACON', ' 4 ETAIS 2.50M ', '24249.0']], 0, mapping);
    expect(records).toEqual([jasmine.objectContaining({line: 2, barcode: '0000000000228', type: 'MACON', title: '4 ETAIS 2.50M', id: '24249'})]);
  });

  it('keeps the leading zeros of a barcode and skips the empty lines', () => {
    const records = toRecords([['h'], ['', '', ''], ['0001200', 'MPHO', 'Appareil', '']], 0, mapping);
    expect(records).toHaveSize(1);
    expect(records[0].barcode).toBe('0001200');
    expect(records[0].line).toBe(3);
  });
});
