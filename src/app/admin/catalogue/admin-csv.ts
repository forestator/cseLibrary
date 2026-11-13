import {AdminRow} from './admin-sort';

export interface CsvColumn<Row = AdminRow> {
  header: string;
  value(row: Row): string;
}

// A cell starting with one of these is read as a formula by spreadsheets: prefixed with an apostrophe.
const FORMULA_START = /^[=+\-@\t\r]/;

function cell(text: string): string {
  const safe = FORMULA_START.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

/**
 * The rows as a CSV file French spreadsheets open correctly: UTF-8 with a byte order mark, `;` as separator,
 * every cell quoted, Windows line ends.
 */
export function toCsv<Row = AdminRow>(rows: ReadonlyArray<Row>, columns: ReadonlyArray<CsvColumn<Row>>): string {
  const lines = [columns.map(column => cell(column.header)), ...rows.map(row => columns.map(column => cell(column.value(row))))];
  return '﻿' + lines.map(line => line.join(';')).join('\r\n') + '\r\n';
}

/** Offers the CSV as a download named `fileName`. */
export function downloadCsv(document: Document, fileName: string, csv: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
