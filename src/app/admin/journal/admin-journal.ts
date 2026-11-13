import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {catchError, map, of, startWith} from 'rxjs';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../catalogue/models/count-label';
import {ColumnSort, nextSort, sortWith} from '../catalogue/admin-sort';
import {JOURNAL_ACTION_LABELS, JournalAction} from './journal-entry';
import {JournalRecord, JournalRepository} from './journal.repository';

type JournalColumn = 'date' | 'user' | 'action' | 'collection' | 'item';

interface JournalRow {
  record: JournalRecord;
  date: string;
  actionLabel: string;
}

const PAGE_SIZE = 100;
const COLUMNS: ReadonlyArray<{column: JournalColumn; label: string}> = [
  {column: 'date', label: 'Date'},
  {column: 'user', label: 'Administrateur'},
  {column: 'action', label: 'Action'},
  {column: 'collection', label: 'Commission'},
  {column: 'item', label: 'Objet'},
];

const dateFormat = new Intl.DateTimeFormat('fr-FR', {dateStyle: 'short', timeStyle: 'short'});

function plain(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** The journal of the changes made from the administration, for the super-administrators. */
@Component({
  selector: 'app-admin-journal',
  templateUrl: './admin-journal.html',
  styleUrl: './admin-journal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CataloguePageHeader, MatButton, MatIcon, RouterLink],
})
export class AdminJournal {
  private readonly loaded = toSignal(
    inject(JournalRepository).recent$().pipe(map(records => ({records, failed: false})), catchError(() => of({records: [] as JournalRecord[], failed: true})), startWith(undefined)));

  protected readonly actions = (Object.keys(JOURNAL_ACTION_LABELS) as JournalAction[]).map(action => ({action, label: JOURNAL_ACTION_LABELS[action]}));
  protected readonly search = signal('');
  protected readonly actionFilter = signal<JournalAction | null>(null);
  protected readonly sort = signal<ColumnSort<JournalColumn> | null>(null);
  private readonly limit = signal(PAGE_SIZE);

  protected readonly loading = computed(() => this.loaded() === undefined);
  protected readonly failed = computed(() => this.loaded()?.failed ?? false);

  private readonly rows = computed<JournalRow[]>(() => (this.loaded()?.records ?? []).map(record => ({
    record, date: dateFormat.format(record.at), actionLabel: JOURNAL_ACTION_LABELS[record.action],
  })));
  private readonly filtered = computed(() => {
    const words = plain(this.search()).split(/\s+/).filter(Boolean);
    const action = this.actionFilter();
    return this.rows().filter(row =>
      (!action || row.record.action === action)
      && words.every(word => plain(`${row.record.email} ${row.record.collectionLabel} ${row.record.itemName} ${row.record.summary} ${row.record.names.join(' ')}`).includes(word)));
  });
  private readonly sorted = computed(() => sortWith(this.filtered(), this.sort(), (row, column) => {
    switch (column) {
      case 'date': return row.record.at.toISOString();
      case 'user': return row.record.email;
      case 'action': return row.actionLabel;
      case 'collection': return row.record.collectionLabel;
      case 'item': return row.record.itemName;
    }
  }));
  protected readonly visible = computed(() => this.sorted().slice(0, this.limit()));
  protected readonly remaining = computed(() => Math.max(0, this.sorted().length - this.limit()));
  protected readonly nextPageSize = computed(() => Math.min(PAGE_SIZE, this.remaining()));
  protected readonly resultLabel = computed(() => countLabel(this.filtered().length));

  protected readonly headers = computed(() => {
    const sort = this.sort();
    return COLUMNS.map(header => {
      const active = sort?.column === header.column;
      return {
        ...header,
        ariaSort: active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : null,
        icon: active ? (sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more',
      };
    });
  });

  protected setSearch(value: string): void {
    this.search.set(value);
    this.limit.set(PAGE_SIZE);
  }

  protected setAction(action: JournalAction | null): void {
    this.actionFilter.set(action);
    this.limit.set(PAGE_SIZE);
  }

  protected sortBy(column: JournalColumn): void {
    this.sort.update(current => nextSort(current, column));
    this.limit.set(PAGE_SIZE);
  }

  protected showMore(): void {
    this.limit.update(limit => limit + PAGE_SIZE);
  }
}
