import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {CatalogueField, ColumnMapping, FIELD_LABELS, FIELDS, guessColumns, missingFields, toRecords} from './column-mapping';
import {RawTable, readTableFile} from './table-file';

const PREVIEW_ROWS = 8;
const ACCEPTED = '.xls,.xlsx,.xlsm,.xlsb,.ods,.csv,.tsv,.txt';
// "Ã" followed by a symbol and the replacement character are what a wrongly decoded accent leaves behind.
const DAMAGED_TEXT = /Ã.|�/;

/** Letters of a spreadsheet column, for headers that have no name: A, B, … Z, AA. */
function columnLetters(index: number): string {
  let letters = '';
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    letters = String.fromCharCode(65 + ((rest - 1) % 26)) + letters;
  }
  return letters;
}

/**
 * Reconciliation of the catalogue with an export of the management software. First step: read a file in any common
 * format (XLS, XLSX, ODS, CSV, TSV), find its columns or let the user say which is which, and show what was understood.
 */
@Component({
  selector: 'app-admin-reconciliation',
  templateUrl: './admin-reconciliation.html',
  styleUrl: './admin-reconciliation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CataloguePageHeader, MatButton, MatIcon, RouterLink],
})
export class AdminReconciliation {
  protected readonly accepted = ACCEPTED;
  protected readonly fileName = signal('');
  protected readonly reading = signal(false);
  protected readonly error = signal<string | undefined>(undefined);
  protected readonly dragging = signal(false);
  private readonly tables = signal<RawTable[]>([]);
  protected readonly sheetIndex = signal(0);
  private readonly chosenMapping = signal<ColumnMapping | undefined>(undefined);

  private readonly table = computed(() => this.tables()[this.sheetIndex()] as RawTable | undefined);
  private readonly guess = computed(() => {
    const table = this.table();
    return table ? guessColumns(table.rows) : null;
  });
  private readonly headerRow = computed(() => this.guess()?.headerRow ?? 0);
  protected readonly mapping = computed<ColumnMapping>(() => this.chosenMapping() ?? this.guess()?.mapping ?? {});

  protected readonly sheets = computed(() => this.tables().map((table, index) => ({index, name: table.name, rows: table.rows.length})));
  protected readonly hasFile = computed(() => this.tables().length > 0);
  protected readonly columnNames = computed(() =>
    (this.table()?.rows[this.headerRow()] ?? []).map((name, index) => name || `Colonne ${columnLetters(index)}`));
  protected readonly fieldRows = computed(() => FIELDS.map(field => ({
    field,
    label: FIELD_LABELS[field],
    column: this.mapping()[field] ?? -1,
    options: [{value: -1, label: 'Non utilisé'}, ...this.columnNames().map((label, value) => ({value, label}))],
  })));
  protected readonly missing = computed(() => missingFields(this.mapping()).map(field => FIELD_LABELS[field]));
  protected readonly ready = computed(() => this.hasFile() && this.missing().length === 0);

  private readonly records = computed(() => {
    const table = this.table();
    return table && this.ready() ? toRecords(table.rows, this.headerRow(), this.mapping()) : [];
  });
  protected readonly recordCount = computed(() => this.records().length);
  protected readonly preview = computed(() => this.records().slice(0, PREVIEW_ROWS));
  protected readonly damaged = computed(() =>
    this.records().filter(record => DAMAGED_TEXT.test(`${record.title} ${record.subtitle} ${record.author}`)).length);

  protected pick(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      void this.read(file);
    }
  }

  protected drop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files.item(0);
    if (file) {
      void this.read(file);
    }
  }

  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected chooseSheet(index: string): void {
    this.sheetIndex.set(Number(index));
    this.chosenMapping.set(undefined);
  }

  protected chooseColumn(field: CatalogueField, column: string): void {
    const next: ColumnMapping = {...this.mapping()};
    if (Number(column) < 0) {
      delete next[field];
    } else {
      next[field] = Number(column);
    }
    this.chosenMapping.set(next);
  }

  private async read(file: File): Promise<void> {
    this.reading.set(true);
    this.error.set(undefined);
    try {
      const tables = (await readTableFile(file)).filter(table => table.rows.length > 0);
      if (!tables.length) {
        throw new Error('empty');
      }
      this.tables.set(tables);
      this.fileName.set(file.name);
      this.sheetIndex.set(0);
      this.chosenMapping.set(undefined);
    } catch (error) {
      console.error('Unable to read the file', error);
      this.tables.set([]);
      this.fileName.set('');
      this.error.set(`« ${file.name} » n'a pas pu être lu : formats acceptés XLS, XLSX, ODS, CSV, TSV et TXT, avec une ligne d'en-têtes.`);
    } finally {
      this.reading.set(false);
    }
  }
}
