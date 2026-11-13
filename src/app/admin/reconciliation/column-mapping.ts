/** The columns of a catalogue export that the reconciliation uses. */
export type CatalogueField = 'barcode' | 'type' | 'title' | 'subtitle' | 'author' | 'cote' | 'year' | 'id';

export const FIELD_LABELS: Readonly<Record<CatalogueField, string>> = {
  barcode: 'Code-barres',
  type: 'Type',
  title: 'Titre',
  subtitle: 'Sous-titre',
  author: 'Auteur',
  cote: 'Cote',
  year: 'Année',
  id: 'Identifiant',
};

export const FIELDS = Object.keys(FIELD_LABELS) as CatalogueField[];

/** A title is needed to recognise anything; the type or the cote is needed to know where an item belongs. */
const REQUIRED: ReadonlyArray<CatalogueField> = ['title'];

// Header names, once folded (lower case, no accent, letters and digits only). The first block is the export of the
// management software used today; the others are what other tools and a hand-made list are likely to call them.
const ALIASES: Readonly<Record<CatalogueField, ReadonlyArray<string>>> = {
  barcode: ['obcodebar', 'codebar', 'codebarre', 'codebarres', 'codesbarres', 'ean', 'ean13', 'isbn', 'isbn13', 'gtin', 'upc'],
  type: ['thcode', 'type', 'typedocument', 'theme', 'categorie', 'rayon', 'famille', 'genre', 'support', 'classe'],
  title: ['ovtitre', 'titre', 'title', 'nom', 'intitule', 'designation', 'libelle', 'objet', 'article', 'jeu'],
  subtitle: ['ovstitre', 'soustitre', 'stitre', 'subtitle', 'complement', 'suitedutitre'],
  author: ['ovnomaut', 'nomaut', 'nomauteur', 'auteur', 'auteurs', 'author', 'createur', 'editeur'],
  cote: ['ovcotedewey', 'cotedewey', 'cote', 'cotation', 'reference', 'ref', 'numerocote', 'localisation'],
  year: ['ovannee', 'annee', 'anneeedition', 'anneedeparution', 'year', 'date', 'parution'],
  id: ['ovid', 'id', 'identifiant', 'numero', 'inventaire', 'numinventaire', 'numeroinventaire', 'idobjet'],
};

export type ColumnMapping = Partial<Record<CatalogueField, number>>;

export interface HeaderGuess {
  /** Index of the row holding the column names (a list may start with a title or blank lines). */
  headerRow: number;
  mapping: ColumnMapping;
}

const fold = (text: string): string => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const HEADER_SEARCH_ROWS = 15;

/** Finds the header row (the one naming the most known columns) and which column is which. `null` when none is recognised. */
export function guessColumns(rows: ReadonlyArray<ReadonlyArray<string>>): HeaderGuess | null {
  let best: HeaderGuess | null = null;
  rows.slice(0, HEADER_SEARCH_ROWS).forEach((row, headerRow) => {
    const mapping: ColumnMapping = {};
    const folded = row.map(fold);
    for (const field of FIELDS) {
      const column = folded.findIndex((name, index) => ALIASES[field].includes(name) && !Object.values(mapping).includes(index));
      if (column >= 0) {
        mapping[field] = column;
      }
    }
    if (Object.keys(mapping).length > Object.keys(best?.mapping ?? {}).length) {
      best = {headerRow, mapping};
    }
  });
  return best && Object.keys((best as HeaderGuess).mapping).length >= 2 ? best : null;
}

/** The fields that are needed and have no column yet. */
export function missingFields(mapping: ColumnMapping): CatalogueField[] {
  const missing = REQUIRED.filter(field => mapping[field] === undefined);
  return mapping.type === undefined && mapping.cote === undefined ? [...missing, 'type'] : missing;
}

export interface CatalogueRecord {
  /** 1-based line of the file, to find the row again. */
  line: number;
  barcode: string;
  type: string;
  title: string;
  subtitle: string;
  author: string;
  cote: string;
  year: string;
  id: string;
}

/** The rows after the header as records. Cells are trimmed, a number written with a trailing `.0` loses it, empty lines are skipped. */
export function toRecords(rows: ReadonlyArray<ReadonlyArray<string>>, headerRow: number, mapping: ColumnMapping): CatalogueRecord[] {
  const cell = (row: ReadonlyArray<string>, field: CatalogueField): string => {
    const column = mapping[field];
    return column === undefined ? '' : (row[column] ?? '').trim().replace(/^(\d+)\.0+$/, '$1');
  };
  return rows.slice(headerRow + 1).flatMap((row, index) => {
    const record: CatalogueRecord = {
      line: headerRow + index + 2,
      barcode: cell(row, 'barcode'), type: cell(row, 'type'), title: cell(row, 'title'), subtitle: cell(row, 'subtitle'),
      author: cell(row, 'author'), cote: cell(row, 'cote'), year: cell(row, 'year'), id: cell(row, 'id'),
    };
    return record.title || record.barcode ? [record] : [];
  });
}
