import {compareGameRefs} from './game-ref';

describe('compareGameRefs', () => {
  const sorted = (refs: string[]) => [...refs].sort(compareGameRefs);

  it('puts the highest ludo number first', () => {
    expect(sorted(['ludo9', 'ludo343', 'ludo100'])).toEqual(['ludo343', 'ludo100', 'ludo9']);
  });

  it('puts references without an inventory number, bar codes included, last', () => {
    expect(sorted(['3558380002475', 'ludo12', 'SCTJR', 'ludo300'])).toEqual(['ludo300', 'ludo12', '3558380002475', 'SCTJR']);
  });
});
