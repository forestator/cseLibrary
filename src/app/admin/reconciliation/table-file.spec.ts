import {decodeText, detectDelimiter, isSupportedFile, isTextFile, parseDelimited} from './table-file';

const bytes = (...values: number[]) => new Uint8Array(values);

describe('decodeText', () => {
  it('reads UTF-8, with or without a byte order mark', () => {
    expect(decodeText(new TextEncoder().encode('Astérix'))).toBe('Astérix');
    expect(decodeText(new TextEncoder().encode('﻿Astérix'))).toBe('Astérix');
  });

  it('falls back to Windows-1252 for the accents of an old CSV', () => {
    expect(decodeText(bytes(0x41, 0x73, 0x74, 0xe9, 0x72, 0x69, 0x78))).toBe('Astérix');
    expect(decodeText(bytes(0x80))).toBe('€');
  });

  it('reads UTF-16 announced by its byte order mark', () => {
    expect(decodeText(bytes(0xff, 0xfe, 0x41, 0x00, 0xe9, 0x00))).toBe('Aé');
  });
});

describe('detectDelimiter', () => {
  it('finds the separator that gives every line the same number of cells', () => {
    expect(detectDelimiter('a;b;c\n1;2;3\n4;5;6')).toBe(';');
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t');
    expect(detectDelimiter('a|b\n1|2')).toBe('|');
  });

  it('is not fooled by a separator inside quotes or a comma in the text', () => {
    expect(detectDelimiter('titre;auteur\n"Astérix, le Gaulois";Goscinny\n"Tintin, au Tibet";Hergé')).toBe(';');
  });
});

describe('parseDelimited', () => {
  it('splits rows and cells, with Windows or Unix line ends', () => {
    expect(parseDelimited('a;b\r\n1;2\n3;4', ';')).toEqual([['a', 'b'], ['1', '2'], ['3', '4']]);
  });

  it('keeps separators, line breaks and doubled quotes inside quoted cells', () => {
    expect(parseDelimited('"a;b";"ligne 1\nligne 2";"dit ""oui"""', ';')).toEqual([['a;b', 'ligne 1\nligne 2', 'dit "oui"']]);
  });

  it('drops empty lines and keeps empty cells', () => {
    expect(parseDelimited('a;;c\n\n;;\n1;2;3\n', ';')).toEqual([['a', '', 'c'], ['1', '2', '3']]);
  });

  it('reads a last line without a line end', () => {
    expect(parseDelimited('a;b\n1;2', ';')).toEqual([['a', 'b'], ['1', '2']]);
  });
});

describe('isTextFile', () => {
  it('tells text tables from spreadsheets by the extension', () => {
    expect(['a.csv', 'A.TSV', 'b.txt'].every(isTextFile)).toBeTrue();
    expect(['a.xls', 'a.xlsx', 'a.ods', 'a'].some(isTextFile)).toBeFalse();
  });
});

describe('isSupportedFile', () => {
  it('accepts the spreadsheets and the text tables, whatever the case', () => {
    expect(['a.xls', 'a.XLSX', 'a.xlsm', 'a.xlsb', 'a.ods', 'a.csv', 'a.tsv', 'a.txt'].every(isSupportedFile)).toBeTrue();
  });

  it('refuses what is not a table', () => {
    expect(['a.pdf', 'a.docx', 'a.png', 'noextension', 'xlsx'].some(isSupportedFile)).toBeFalse();
  });
});
