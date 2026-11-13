// Regenerates cypress/fixtures/catalogue/*: the same small catalogue export written in every format the reconciliation reads.
// Run with: node scripts/e2e/make-catalogue-fixtures.mjs
import * as fs from 'node:fs';
import {mkdirSync, writeFileSync} from 'node:fs';
import * as XLSX from 'xlsx';

XLSX.set_fs(fs);

const OUT = 'cypress/fixtures/catalogue';
mkdirSync(OUT, {recursive: true});

const HEADER = ['ob_codebar', 'th_code', 'ov_titre', 'ov_stitre', 'ov_nomaut', 'ov_cotedewey', 'ov_annee', 'ov_id'];
const BASE = [
  ['0000000000228', 'MACON', '4 ETAIS 2.50M', '', '', '', '', 24249],
  ['0778988323496', 'LDSCT', '5 Minutes Marvel', '', '', '', '', 28286],
  ['3760207030381', 'LDSCT', '50 Missions', '', '', 'Ludo196', 2023, 28665],
  ['9782918771111', 'BDAD', 'Astérix & Obélix', 'Baffez-les tous', 'GOSCINNY René', 'AST', 1980, 25939],
  ['0000000501385', 'REB', 'DAMIEN', 'DU SPITSBERG AU CAP HORN', '', 'D910.4-JAN-V1', '', 1385],
  ['9782081314214', 'ROM', 'Ça m’énerve', '', 'ADAM OLIVIER', 'R-ADA', 2019, 31422],
  ['0045496501419', '3DS', 'CONSOLE 2DS Bleue', '', '', '3DS-CONSL16', '', 25150],
  ['0000000001203', 'MPHO', 'Le "grand" jeu; suite', 'tome 2', '', 'NUMERIC8', '', 29641],
];
const rows = Array.from({length: 40}, (_, index) => {
  const [barcode, type, title, subtitle, author, cote, year, id] = BASE[index % BASE.length];
  return index < BASE.length ? BASE[index] : [barcode, type, `${title} (${index})`, subtitle, author, cote, year, Number(id) + index];
});
const table = [HEADER, ...rows];

const sheet = data => XLSX.utils.aoa_to_sheet(data);
const book = (sheets) => {
  const workbook = XLSX.utils.book_new();
  for (const [name, data] of sheets) {
    XLSX.utils.book_append_sheet(workbook, sheet(data), name);
  }
  return workbook;
};
const csv = (data, separator) => data.map(line => line.map(cell => {
  const text = String(cell);
  return text.includes(separator) || text.includes('"') || text.includes('\n') ? `"${text.replaceAll('"', '""')}"` : text;
}).join(separator)).join('\r\n') + '\r\n';

XLSX.writeFile(book([['catalogue', table]]), `${OUT}/sample.xlsx`);
XLSX.writeFile(book([['catalogue', table]]), `${OUT}/sample.xls`, {bookType: 'biff8'});
XLSX.writeFile(book([['catalogue', table]]), `${OUT}/sample.ods`, {bookType: 'ods'});
writeFileSync(`${OUT}/sample-utf8.csv`, '﻿' + csv(table, ';'));
// What French spreadsheets still save: Windows-1252 text (every accent of the sample is in Latin-1), semicolons.
writeFileSync(`${OUT}/sample-windows1252.csv`, Buffer.from(csv(table, ';').replace('’', "'"), 'latin1'));
writeFileSync(`${OUT}/sample.tsv`, csv(table, '\t'));
XLSX.writeFile(book([['Notes', [['Export du 10 novembre'], ['à lire en premier']]], ['Catalogue', table]]), `${OUT}/sample-two-sheets.xlsx`);
writeFileSync(`${OUT}/sample-title-lines.csv`, csv([['Catalogue de la médiathèque'], [''], ...table], ';'));
// Headers the program does not know: the user says which column is which.
writeFileSync(`${OUT}/sample-unknown-headers.csv`, csv([['Colonne 1', 'Colonne 2', 'Colonne 3', 'Colonne 4'], ...rows.map(row => [row[0], row[1], row[2], row[5]])], ';'));
writeFileSync(`${OUT}/not-a-table.pdf`, '%PDF-1.4 not a table');
console.log('fixtures written to', OUT);
