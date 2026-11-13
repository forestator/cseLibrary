import {Proposal} from './catalogue-classification';
import {Addition, additionValues, groupByDomain, planAdditions, uniqueKey} from './reconciliation-apply';
import {DbItem} from './reconcile';

const proposal = (overrides: Partial<Proposal>): Proposal => ({
  record: {line: 2, barcode: '', type: '', title: '', subtitle: '', author: '', cote: '', year: '', id: '1'},
  domain: 'bricolage', key: '833', otherKeys: [], name: 'Burin Perfo', category: 'Perçage&Meulage', ...overrides,
});
const addition = (overrides: Partial<Proposal>, name = 'Burin Perfo'): Addition => ({proposal: proposal(overrides), name, category: overrides.category ?? 'Perçage&Meulage'});
const db = (domain: DbItem['domain'], key: string): DbItem => ({domain, key, name: key, collectionId: domain});

describe('uniqueKey', () => {
  it('keeps a free key, and numbers a taken one without ever reusing it', () => {
    expect(uniqueKey('833', new Set(['12']))).toBe('833');
    expect(uniqueKey('1215', new Set(['1215']))).toBe('1215-2');
    expect(uniqueKey('1215', new Set(['1215', '12152']))).toBe('1215-3');
  });

  it('ignores case, spaces and dashes when it compares', () => {
    expect(uniqueKey('SW-1250', new Set(['sw1250']))).toBe('SW-1250-2');
  });
});

describe('planAdditions', () => {
  it('never takes the key of an item that is already in the database', () => {
    const planned = planAdditions([addition({domain: 'videoGames', key: '1215', category: 'wii'}, 'Splatoon')], [db('videoGames', '1215')]);
    expect(planned[0].key).toBe('1215-2');
  });

  it('shares the references of the three kinds of games, but not between commissions', () => {
    const games = planAdditions([addition({domain: 'outsideGames', key: 'ludo5', category: 'outsideGames'}, 'X')], [db('boardGames', 'ludo5')]);
    expect(games[0].key).toBe('ludo5-2');
    const tools = planAdditions([addition({domain: 'photo', key: '833', category: 'divers'}, 'X')], [db('bricolage', '833')]);
    expect(tools[0].key).toBe('833');
  });

  it('gives different keys to two additions of one batch that would collide', () => {
    const planned = planAdditions([addition({key: '700'}, 'A'), addition({key: '700'}, 'B')], []);
    expect(planned.map(item => item.key)).toEqual(['700', '700-2']);
  });
});

describe('additionValues', () => {
  it('writes a tool or a photo item the way the catalogue form does', () => {
    const [planned] = planAdditions([addition({}, 'Burin perforateur')], []);
    expect(additionValues(planned)).toEqual({name: 'Burin perforateur', id: '833', categoryId: 'Perçage&Meulage', status: 'AVAILABLE', description: ''});
  });

  it('writes a game the way the game form does, as old stock, with the type of a video game', () => {
    const [planned] = planAdditions([addition({domain: 'videoGames', key: '1157', category: 'ps4', type: 'CONSOLE'}, 'Console PS4')], []);
    expect(additionValues(planned)).toEqual({name: 'Console PS4', ref: '1157', category: 'ps4', status: 'AVAILABLE', isNew: false, type: 'CONSOLE'});
    const [board] = planAdditions([addition({domain: 'boardGames', key: 'ludo1', category: 'enfant'}, 'Jeu')], []);
    expect(additionValues(board)).not.toEqual(jasmine.objectContaining({type: jasmine.anything()}));
    expect(additionValues(board)['isNew']).toBeFalse();
  });
});

describe('groupByDomain', () => {
  it('groups items by domain, keeping their order', () => {
    const groups = groupByDomain(['a', 'bb', 'c'], text => (text.length > 1 ? 'photo' : 'bricolage'));
    expect(groups.get('bricolage')).toEqual(['a', 'c']);
    expect(groups.get('photo')).toEqual(['bb']);
  });
});
