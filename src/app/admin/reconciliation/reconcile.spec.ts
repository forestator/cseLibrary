import {CatalogueRecord} from './column-mapping';
import {DbItem, Decisions, reconcile, sameName, similarName} from './reconcile';

const record = (overrides: Partial<CatalogueRecord>): CatalogueRecord => ({
  line: 2, barcode: '', type: '', title: '', subtitle: '', author: '', cote: '', year: '', id: '1', ...overrides,
});
const NONE: Decisions = {ignoredLines: new Set()};
const tool = (key: string, name: string, category = 'Perçage&Meulage'): DbItem => ({domain: 'bricolage', key, name, category, collectionId: 'bricolage'});
const game = (key: string, name: string, category: string, domain: DbItem['domain'] = 'videoGames'): DbItem => ({domain, key, name, category, collectionId: domain});

describe('sameName and similarName', () => {
  it('sees one name in another, a typo and a plural as similar, but a different game as different', () => {
    expect(similarName('FC26', 'EA Sports FC 26')).toBeTrue();
    expect(similarName('Juste dance 2025', 'Just Dance 2025')).toBeTrue();
    expect(similarName('Echasse Adulte', 'ECHASSES ADULTES')).toBeTrue();
    expect(similarName('Super Mario Party', '51 Worldwide Games')).toBeFalse();
  });

  it('ignores the age mention of a game', () => {
    expect(sameName('Batik', 'BATIK (>  6 ans)')).toBeTrue();
  });
});

describe('reconcile: the three tiers', () => {
  const burin = record({type: 'PERC', title: 'BURIN PERFO', barcode: '0000000000833'});

  it('matches the same key, whatever the name curated since', () => {
    const result = reconcile([record({type: 'MACON', title: '4 ETAIS 2.50M', barcode: '0000000000228'})], [tool('228', 'Etais (X4)', 'Maçonnerie&Carrelage')], NONE);
    expect(result.matched).toBe(1);
    expect(result.toAdd).toEqual([]);
    expect(result.conflicts).toEqual([]);
  });

  it('proposes as new only what has neither the key nor a similar name', () => {
    const result = reconcile([burin, record({type: 'PERC', title: 'MEULE 800 W', barcode: '0000000000807'})], [tool('999', 'Perforateur burineur')], NONE);
    expect(result.toAdd.map(proposal => proposal.key)).toEqual(['833', '807']);
  });

  it('lists as probable an item that exists under another key', () => {
    const result = reconcile([record({type: 'PS5', title: 'FC26', cote: '', id: '29485'})], [game('1515', 'EA Sports FC 26', 'ps5')], NONE);
    expect(result.toAdd).toEqual([]);
    expect(result.probable).toHaveSize(1);
    expect(result.probable[0].item.key).toBe('1515');
  });

  it('finds a board game filed among the outside games, and the other way round', () => {
    const result = reconcile([record({type: 'LDSCT', title: 'Billard Hollandais', barcode: '9780201356878', cote: 'BillardH'})],
      [game('9780201356878', 'BILLARD HOLLANDAIS', 'outsideGames', 'outsideGames')], NONE);
    expect(result.matched).toBe(1);
    expect(result.toAdd).toEqual([]);
  });

  it('flags the same key with a name that has nothing in common', () => {
    const result = reconcile([record({type: 'MPHO', title: 'BRIDGE Konica Minolta Dimage A2', cote: 'NUMERIC1'})],
      [{domain: 'photo', key: 'NUMERIC1', name: 'COMPACT Canon IXUS 210', category: 'appareilsPhoto', collectionId: 'photo'}], NONE);
    expect(result.conflicts).toHaveSize(1);
  });

  it('proposes a move when the file files it elsewhere, but not between Switch and Switch 2', () => {
    const moved = reconcile([record({type: 'MACON', title: 'Palan 1000KG', barcode: '0000000000250'})], [tool('250', 'Palan 1000KG', 'Mecanique')], NONE);
    expect(moved.moves).toHaveSize(1);
    const sameFamily = reconcile([record({type: 'SW', title: 'Mario Kart World', cote: 'SW-1300'})], [game('1300', 'Mario Kart World', 'switch2')], NONE);
    expect(sameFamily.moves).toEqual([]);
  });

  it('keeps the second line of a key the file repeats apart, and one item is matched only once', () => {
    const result = reconcile([burin, record({type: 'PERC', title: 'BURIN PERFO bis', barcode: '0000000000833', line: 3})], [tool('833', 'Perforateur burineur')], NONE);
    expect(result.duplicates).toHaveSize(1);
    expect(result.matched).toBe(1);
  });
});

describe('reconcile: what the file does not cover', () => {
  it('lists as missing only the database items of the collections the file covers', () => {
    const result = reconcile([record({type: 'PERC', title: 'BURIN PERFO', barcode: '0000000000833'})],
      [tool('833', 'Burin perfo'), tool('901', 'Tyrolienne'), {domain: 'photo', key: 'X', name: 'Appareil', collectionId: 'photo'}], NONE);
    expect(result.missing.map(item => item.key)).toEqual(['901']);
  });

  it('counts what is set aside by reason, the codes it does not know, and the books, without listing them', () => {
    const result = reconcile([
      record({type: 'BDAD', title: 'ASTERIX'}), record({type: 'BDAD', title: 'TINTIN'}), record({type: 'ZZZ', title: 'Chose'}),
      record({type: 'ROM', title: 'PEINE PERDUE'}),
    ], [], NONE);
    expect(result.ignored.get('BD et mangas')).toBe(2);
    expect(result.unclassified.get('ZZZ')).toBe(1);
    expect(result.books).toBe(1);
  });

  it('does not propose again what the user said to stop proposing', () => {
    const result = reconcile([record({type: 'PERC', title: 'BURIN PERFO', barcode: '0000000000833', id: '5'})], [], {ignoredLines: new Set(['5'])});
    expect(result.toAdd).toEqual([]);
    expect(result.ignored.get('Ne plus proposer (décision enregistrée)')).toBe(1);
  });
});

describe('reconcile: idempotence', () => {
  it('has nothing left to add once what it proposed is in the database', () => {
    const records = [
      record({type: 'PERC', title: 'BURIN PERFO', barcode: '0000000000833'}),
      record({type: 'PS4', title: 'DESTINY', cote: 'PS4-1157'}),
      record({type: 'SCTJR', title: 'JUNGLE SPEED', barcode: '3571880000109'}),
    ];
    const first = reconcile(records, [], NONE);
    expect(first.toAdd).toHaveSize(3);
    const written: DbItem[] = first.toAdd.map(added => ({domain: added.domain, key: added.key, name: added.name, category: added.category, collectionId: added.domain}));
    const second = reconcile(records, written, NONE);
    expect(second.toAdd).toEqual([]);
    expect(second.probable).toEqual([]);
    expect(second.matched).toBe(3);
  });
});
