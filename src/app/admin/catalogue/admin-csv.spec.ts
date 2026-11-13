import {toCsv} from './admin-csv';
import {AdminRow} from './admin-sort';

const row = (name: string, ref?: string): AdminRow => ({
  item: {key: name, id: name, collectionId: 'c', name, ref, source: {id: name, name}},
  collectionLabel: '', categoryLabel: '', statusLabel: '',
});
const columns = [
  {header: 'Nom', value: (candidate: AdminRow) => candidate.item.name},
  {header: 'Réf.', value: (candidate: AdminRow) => candidate.item.ref ?? ''},
];

describe('toCsv', () => {
  it('starts with a byte order mark, separates with semicolons and ends lines like Windows', () => {
    const csv = toCsv([row('Catan', 'ludo1')], columns);
    expect(csv.startsWith('﻿')).toBeTrue();
    expect(csv).toBe('﻿"Nom";"Réf."\r\n"Catan";"ludo1"\r\n');
  });

  it('keeps semicolons, line breaks and quotes inside a cell', () => {
    const csv = toCsv([row('Le "grand"; jeu\nsuite')], columns);
    expect(csv).toContain('"Le ""grand""; jeu\nsuite";""');
  });

  it('defuses cells a spreadsheet would read as a formula', () => {
    const csv = toCsv([row('=SOMME(A1)'), row('@cmd')], columns);
    expect(csv).toContain(`"'=SOMME(A1)"`);
    expect(csv).toContain(`"'@cmd"`);
  });

  it('writes only the header for an empty list', () => {
    expect(toCsv([], columns)).toBe('﻿"Nom";"Réf."\r\n');
  });
});
