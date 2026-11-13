import {AdminRow} from './admin-sort';

export interface CsvColumn {
  header: string;
  value(row: AdminRow): string;
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
export function toCsv(rows: ReadonlyArray<AdminRow>, columns: ReadonlyArray<CsvColumn>): string {
  const lines = [columns.map(column => cell(column.header)), ...rows.map(row => columns.map(column => cell(column.value(row))))];
  return '﻿' + lines.map(line => line.join(';')).join('\r\n') + '\r\n';
}
