import {DOCUMENT, NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RouterLink} from '@angular/router';
import {combineLatest, firstValueFrom, map} from 'rxjs';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {BricoCategories, PhotoCategory} from '../../catalogue/models/catalogue-categories';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {BoardGameCategory} from '../../models/boardGame.model';
import {Consoles} from '../../models/videoGames.model';
import {AdminCollection, AdminItem} from '../catalogue/admin-collection.model';
import {AdminCollections} from '../catalogue/admin-collections';
import {CsvColumn, downloadCsv, toCsv} from '../catalogue/admin-csv';
import {ConfirmationData, ConfirmationModal} from '../components/confirmation-modal/confirmation-modal.component';
import {Domain} from './catalogue-classification';
import {CatalogueField, ColumnMapping, FIELD_LABELS, FIELDS, guessColumns, missingFields, toRecords} from './column-mapping';
import {Addition, additionValues, groupByDomain, planAdditions} from './reconciliation-apply';
import {ReconciliationRepository} from './reconciliation.repository';
import {DbItem, decisionKey, reconcile} from './reconcile';
import {RawTable, readTableFile} from './table-file';

const PREVIEW_ROWS = 8;
const ACCEPTED = '.xls,.xlsx,.xlsm,.xlsb,.ods,.csv,.tsv,.txt';
// "Ã" followed by a symbol and the replacement character are what a wrongly decoded accent leaves behind.
const DAMAGED_TEXT = /Ã.|�/;
const DOMAINS: ReadonlyArray<Domain> = ['bricolage', 'photo', 'boardGames', 'videoGames', 'outsideGames'];
const DOMAIN_LABELS: Readonly<Record<Domain, string>> = {
  bricolage: 'Bricolage', photo: 'Photo & vidéo', boardGames: 'Jeux de société', videoGames: 'Jeux vidéo', outsideGames: 'Grands jeux',
};
const CATEGORY_VALUES: Readonly<Record<Domain, ReadonlyArray<string>>> = {
  bricolage: Object.values(BricoCategories), photo: Object.values(PhotoCategory), boardGames: Object.values(BoardGameCategory),
  videoGames: Object.values(Consoles), outsideGames: ['outsideGames'],
};

interface CategoryOption {
  value: string;
  label: string;
}

/** What the user changed on a line of a list; absent means "as proposed". */
interface RowEdit {
  include?: boolean;
  name?: string;
  category?: string;
}

interface DbEntry {
  db: DbItem;
  admin: AdminItem;
}

/** A line of one of the lists, with everything the table shows. */
interface ListRow {
  line: number;
  decision: string;
  sourceName: string;
  code: string;
  domain: Domain;
  domainLabel: string;
  name: string;
  category: string;
  categoryOptions: CategoryOption[];
  include: boolean;
  dbName?: string;
  dbCategory?: string;
  dbCategoryLabel?: string;
  categoryName?: string;
}

interface ReportRow {
  list: string;
  line: string;
  code: string;
  fileName: string;
  dbName: string;
  domain: string;
  category: string;
  key: string;
  action: string;
}

/** Letters of a spreadsheet column, for headers that have no name: A, B, … Z, AA. */
function columnLetters(index: number): string {
  let letters = '';
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    letters = String.fromCharCode(65 + ((rest - 1) % 26)) + letters;
  }
  return letters;
}

function categoryOptions(domain: Domain): CategoryOption[] {
  return CATEGORY_VALUES[domain].map(value => ({value, label: value === 'outsideGames' ? 'Grand jeu' : categoryLabel(value)}));
}

/**
 * Reconciliation of the catalogue with an export of the management software: read the file, compare it with the
 * database, then add and file what the user ticks. Nothing is written before the confirmation, and nothing is ever
 * deleted: what the database holds and the file lacks is only listed.
 */
@Component({
  selector: 'app-admin-reconciliation',
  templateUrl: './admin-reconciliation.html',
  styleUrl: './admin-reconciliation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CataloguePageHeader, MatButton, MatIcon, NgTemplateOutlet, RouterLink],
})
export class AdminReconciliation {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly document = inject(DOCUMENT);
  private readonly repository = inject(ReconciliationRepository);
  private readonly collections = new Map<string, AdminCollection>(
    inject(AdminCollections).sections.flatMap(section => section.collections).map(collection => [collection.id, collection]));

  protected readonly accepted = ACCEPTED;
  protected readonly fileName = signal('');
  protected readonly reading = signal(false);
  protected readonly applying = signal(false);
  protected readonly error = signal<string | undefined>(undefined);
  protected readonly dragging = signal(false);
  private readonly tables = signal<RawTable[]>([]);
  protected readonly sheetIndex = signal(0);
  private readonly chosenMapping = signal<ColumnMapping | undefined>(undefined);
  private readonly edits = signal<Readonly<Record<number, RowEdit>>>({});
  private readonly ignoredLines = signal<ReadonlySet<string>>(new Set());

  // --- the file ---
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

  // --- the database ---
  private readonly dbEntries = toSignal(combineLatest(DOMAINS.map(domain => (this.collections.get(domain) as AdminCollection).items$.pipe(
    map(items => items.map((admin): DbEntry => ({
      admin,
      db: {domain, key: admin.id, name: admin.name, category: admin.categoryId, collectionId: admin.collectionId},
    })))))).pipe(map(lists => lists.flat())));
  protected readonly databaseReady = computed(() => this.dbEntries() !== undefined);

  // --- the comparison ---
  private readonly comparison = computed(() => {
    const entries = this.dbEntries();
    return this.ready() && entries ? reconcile(this.records(), entries.map(entry => entry.db), {ignoredLines: this.ignoredLines()}) : undefined;
  });
  protected readonly compared = computed(() => this.comparison() !== undefined);
  protected readonly counts = computed(() => {
    const result = this.comparison();
    const total = (counts?: ReadonlyMap<string, number>) => [...(counts?.values() ?? [])].reduce((sum, count) => sum + count, 0);
    return {
      matched: result?.matched ?? 0, toAdd: result?.toAdd.length ?? 0, probable: result?.probable.length ?? 0, moves: result?.moves.length ?? 0,
      conflicts: result?.conflicts.length ?? 0, missing: result?.missing.length ?? 0, duplicates: result?.duplicates.length ?? 0,
      ignored: total(result?.ignored), unclassified: total(result?.unclassified), books: result?.books ?? 0,
    };
  });
  protected readonly ignoredReasons = computed(() => [...(this.comparison()?.ignored ?? [])].map(([label, count]) => ({label, count})));
  protected readonly unclassifiedCodes = computed(() => [...(this.comparison()?.unclassified ?? [])].map(([label, count]) => ({label, count})));

  private row(proposal: {record: {line: number; type: string; title: string}; domain: Domain; name: string; category: string}, include: boolean, matched?: DbItem): ListRow {
    const edit = this.edits()[proposal.record.line] ?? {};
    return {
      line: proposal.record.line,
      decision: decisionKey(proposal.record as never),
      sourceName: proposal.record.title,
      code: proposal.record.type,
      domain: proposal.domain,
      domainLabel: DOMAIN_LABELS[proposal.domain],
      name: edit.name ?? proposal.name,
      category: edit.category ?? proposal.category,
      categoryOptions: categoryOptions(proposal.domain),
      include: edit.include ?? include,
      dbName: matched?.name,
      dbCategory: matched?.category,
      dbCategoryLabel: matched?.category ? categoryLabel(matched.category) : undefined,
    };
  }

  protected readonly toAddRows = computed(() => (this.comparison()?.toAdd ?? []).map(proposal => this.row(proposal, true)));
  protected readonly probableRows = computed(() => (this.comparison()?.probable ?? []).map(match => this.row(match.proposal, false, match.item)));
  protected readonly moveRows = computed(() => (this.comparison()?.moves ?? []).map(match => this.row(match.proposal, false, match.item)));
  protected readonly conflictRows = computed(() => (this.comparison()?.conflicts ?? []).map(match => this.row(match.proposal, false, match.item)));
  protected readonly missingRows = computed(() => (this.comparison()?.missing ?? []).map(item => ({key: item.key, name: item.name, domainLabel: DOMAIN_LABELS[item.domain]})));
  protected readonly duplicateRows = computed(() => (this.comparison()?.duplicates ?? []).map(proposal => this.row(proposal, false)));

  // --- what will be written ---
  private readonly chosenAdditions = computed<Addition[]>(() => {
    const result = this.comparison();
    if (!result) {
      return [];
    }
    const proposals = [...result.toAdd, ...result.probable.map(match => match.proposal)];
    return proposals.flatMap(proposal => {
      const row = this.row(proposal, result.toAdd.includes(proposal));
      return row.include ? [{proposal, name: row.name.trim() || proposal.name, category: row.category}] : [];
    });
  });
  private readonly chosenMoves = computed(() => (this.comparison()?.moves ?? []).flatMap(match => {
    const row = this.row(match.proposal, false, match.item);
    return row.include ? [{match, category: row.category}] : [];
  }));
  protected readonly plan = computed(() => ({additions: this.chosenAdditions().length, moves: this.chosenMoves().length}));
  protected readonly nothingChosen = computed(() => this.plan().additions + this.plan().moves === 0);
  protected readonly decisionsCount = computed(() => this.ignoredLines().size);

  constructor() {
    this.repository.loadIgnoredLines().then(lines => this.ignoredLines.set(lines)).catch(error => console.error('Unable to read the decisions', error));
  }

  // --- the file ---
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
    this.edits.set({});
  }

  protected chooseColumn(field: CatalogueField, column: string): void {
    const next: ColumnMapping = {...this.mapping()};
    if (Number(column) < 0) {
      delete next[field];
    } else {
      next[field] = Number(column);
    }
    this.chosenMapping.set(next);
    this.edits.set({});
  }

  // --- the lists ---
  private edit(line: number, change: RowEdit): void {
    this.edits.update(current => ({...current, [line]: {...current[line], ...change}}));
  }

  protected setIncluded(line: number, included: boolean): void {
    this.edit(line, {include: included});
  }

  protected setName(line: number, name: string): void {
    this.edit(line, {name});
  }

  protected setCategory(line: number, category: string): void {
    this.edit(line, {category});
  }

  /** The line will not be proposed again, with this file or the next ones. */
  protected async ignore(decision: string): Promise<void> {
    try {
      await this.repository.ignoreLines([decision]);
      this.ignoredLines.update(current => new Set([...current, decision]));
      this.snackBar.open('Cette ligne ne sera plus proposée', 'Fermer', {duration: 4000});
    } catch (error) {
      console.error('Unable to save the decision', error);
      this.snackBar.open('Décision non enregistrée : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
    }
  }

  // --- writing ---
  protected async apply(): Promise<void> {
    const {additions, moves} = this.plan();
    const confirmation = this.dialog.open(ConfirmationModal, {
      maxWidth: '440px',
      data: {
        title: 'Appliquer la réconciliation ?',
        confirmText: `${additions} ajout(s) et ${moves} déplacement(s) seront écrits dans la base. Rien n'est supprimé.`,
        confirmLabel: 'Appliquer',
      } satisfies ConfirmationData,
    });
    if (!(await firstValueFrom(confirmation.afterClosed()))) {
      return;
    }
    this.applying.set(true);
    try {
      await this.write();
      this.edits.set({});
      this.snackBar.open(`${additions} ajout(s) et ${moves} déplacement(s) appliqués`, 'Fermer', {duration: 6000});
    } catch (error) {
      console.error('Unable to apply the reconciliation', error);
      this.snackBar.open('Application impossible : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
    } finally {
      this.applying.set(false);
    }
  }

  private async write(): Promise<void> {
    const existing = (this.dbEntries() ?? []).map(entry => entry.db);
    const planned = groupByDomain(planAdditions(this.chosenAdditions(), existing), addition => addition.proposal.domain);
    for (const [domain, additions] of planned) {
      await this.collections.get(domain)?.addMany?.(additions.map(additionValues));
    }
    const moves = groupByDomain(this.chosenMoves().flatMap(({match, category}) => {
      const entry = (this.dbEntries() ?? []).find(candidate => candidate.db === match.item);
      return entry ? [{domain: match.proposal.domain, item: entry.admin, category}] : [];
    }), move => move.domain);
    for (const [domain, domainMoves] of moves) {
      await this.collections.get(domain)?.moveMany?.(domainMoves.map(({item, category}) => ({item, category})));
    }
  }

  // --- the report ---
  protected downloadReport(): void {
    const rows: ReportRow[] = [
      ...this.toAddRows().map(row => this.report('À ajouter', row, row.include ? 'Ajout' : 'Non ajouté')),
      ...this.probableRows().map(row => this.report('Probable (déjà en base ?)', row, row.include ? 'Ajout' : 'Non ajouté')),
      ...this.moveRows().map(row => this.report('Déplacement', row, row.include ? 'Déplacé' : 'Laissé')),
      ...this.conflictRows().map(row => this.report('Conflit de clé', row, 'À vérifier')),
      ...this.duplicateRows().map(row => this.report('Doublon du fichier', row, 'Ignoré')),
      ...this.missingRows().map(row => ({
        list: 'Absent du fichier', line: '', code: '', fileName: '', dbName: row.name, domain: row.domainLabel, category: '', key: row.key, action: 'À vérifier',
      })),
    ];
    const columns: ReadonlyArray<CsvColumn<ReportRow>> = [
      {header: 'Liste', value: row => row.list}, {header: 'Ligne du fichier', value: row => row.line}, {header: 'Code', value: row => row.code},
      {header: 'Nom dans le fichier', value: row => row.fileName}, {header: 'Nom en base', value: row => row.dbName},
      {header: 'Collection', value: row => row.domain}, {header: 'Catégorie', value: row => row.category}, {header: 'Clé', value: row => row.key},
      {header: 'Suite donnée', value: row => row.action},
    ];
    downloadCsv(this.document, `reconciliation-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows, columns));
  }

  private report(list: string, row: ListRow, action: string): ReportRow {
    return {
      list, line: String(row.line), code: row.code, fileName: row.sourceName, dbName: row.dbName ?? '', domain: row.domainLabel,
      category: row.dbCategoryLabel && row.dbCategory !== row.category ? `${row.dbCategoryLabel} → ${categoryLabel(row.category)}` : categoryLabel(row.category),
      key: row.decision, action,
    };
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
      this.edits.set({});
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
