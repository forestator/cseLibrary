/** One sheet (or the only table of a text file): rows of cells, as text. */
export interface RawTable {
  name: string;
  rows: string[][];
}

const TEXT_EXTENSIONS = ['csv', 'tsv', 'txt'];
const SPREADSHEET_EXTENSIONS = ['xls', 'xlsx', 'xlsm', 'xlsb', 'ods', 'fods'];
const DELIMITERS = [';', ',', '\t', '|'];

/**
 * The text of a file: UTF-8 (with or without a byte order mark) or UTF-16 when it announces itself, else the legacy
 * Windows-1252 that French spreadsheets still save CSV files in.
 */
export function decodeText(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes.subarray(2));
  }
  try {
    return new TextDecoder('utf-8', {fatal: true}).decode(bytes).replace(/^﻿/, '');
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

/** The separator that splits the first lines into the same number of cells, quotes taken into account. */
export function detectDelimiter(text: string): string {
  const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim()).slice(0, 20);
  const cellsPerLine = (delimiter: string) => lines.map(line => parseDelimited(line, delimiter)[0]?.length ?? 1);
  let best = {delimiter: ';', score: 0};
  for (const delimiter of DELIMITERS) {
    const counts = cellsPerLine(delimiter);
    const consistent = counts.filter(count => count === counts[0]).length;
    const score = counts[0] > 1 ? consistent * counts[0] : 0;
    if (score > best.score) {
      best = {delimiter, score};
    }
  }
  return best.delimiter;
}

/** RFC 4180 style parsing: quoted cells may hold the separator, line breaks and doubled quotes. Empty lines are dropped. */
export function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const endCell = () => {
    row.push(cell);
    cell = '';
  };
  const endRow = () => {
    endCell();
    if (row.some(value => value.trim() !== '')) {
      rows.push(row);
    }
    row = [];
  };
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"' && cell === '') {
      quoted = true;
    } else if (char === delimiter) {
      endCell();
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[index + 1] === '\n') {
        index++;
      }
      endRow();
    } else {
      cell += char;
    }
  }
  if (cell !== '' || row.length) {
    endRow();
  }
  return rows;
}

const extensionOf = (fileName: string): string => (fileName.includes('.') ? fileName.split('.').pop() ?? '' : '').toLowerCase();

export function isTextFile(fileName: string): boolean {
  return TEXT_EXTENSIONS.includes(extensionOf(fileName));
}

/** Only the formats that are read: SheetJS would take any bytes for a table, and a PDF is not one. */
export function isSupportedFile(fileName: string): boolean {
  return isTextFile(fileName) || SPREADSHEET_EXTENSIONS.includes(extensionOf(fileName));
}

/**
 * Reads a spreadsheet or a text table. Text files (CSV, TSV, TXT) are decoded and split here; the binary formats
 * (XLS, XLSX, XLSM, XLSB, ODS) go through SheetJS, loaded only when such a file is dropped.
 */
export async function readTableFile(file: File): Promise<RawTable[]> {
  if (!isSupportedFile(file.name)) {
    throw new Error(`Unsupported file format: ${file.name}`);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (isTextFile(file.name)) {
    const text = decodeText(bytes);
    return [{name: file.name, rows: parseDelimited(text, detectDelimiter(text))}];
  }
  const sheetjs = await import('xlsx');
  const workbook = sheetjs.read(bytes, {type: 'array'});
  return workbook.SheetNames.map(name => ({
    name,
    rows: (sheetjs.utils.sheet_to_json(workbook.Sheets[name], {header: 1, raw: false, defval: ''}) as unknown[][])
      .map(row => row.map(cell => String(cell ?? '').trim()))
      .filter(row => row.some(cell => cell !== '')),
  }));
}
