import {DOCUMENT, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input, Injector, signal, untracked} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {combineLatest, firstValueFrom, map, of, startWith, switchMap} from 'rxjs';
import {LibraryRepository} from '../../bibliotheque/services/library.repository';
import {SettingsViewComponent} from '../../bibliotheque/components/settings-view/settings-view.component';
import {BadgeComponent} from '../../common/components/book-badge/badge.component';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../catalogue/models/count-label';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {Comissions} from '../../models/common.model';
import {AuthentificationService} from '../../services/firebase/authentification.service';
import {AdminCollection, AdminItem} from './admin-collection.model';
import {ADMIN_DIALOG_CONFIG} from '../admin-dialog.config';
import {ConfirmationData, ConfirmationModal} from '../components/confirmation-modal/confirmation-modal.component';
import {AdminItemDialog, AdminItemDialogData} from '../form/admin-item-dialog';
import {AdminCollections} from './admin-collections';
import {CsvColumn, toCsv} from './admin-csv';
import {AdminRow, AdminSort, AdminSortColumn, nextSort, sortRows} from './admin-sort';

const PAGE_SIZE = 100;

function plain(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Global administration. Without a commission it only offers the commissions the user manages; with one
 * (`/admin/<commission>`) it shows that commission's objects, or the library editor for the library.
 */
@Component({
  selector: 'app-admin-catalogue',
  templateUrl: './admin-catalogue.html',
  styleUrl: './admin-catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, CataloguePageHeader, MatButton, MatCheckbox, MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger,
    NgOptimizedImage, RouterLink, SettingsViewComponent],
})
export class AdminCatalogue {
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);
  private readonly snackBar = inject(MatSnackBar);
  private readonly document = inject(DOCUMENT);
  private readonly sections = inject(AdminCollections).sections;

  /** Super-administrators also get the journal of changes. */
  protected readonly isSuperAdmin = toSignal(inject(AuthentificationService).isUserSuperAdmin, {initialValue: false});

  /** Bound from the route: the commission being managed, if any. */
  readonly commission = input<string>();

  protected readonly search = signal('');
  protected readonly collectionFilter = signal<string | null>(null);
  protected readonly withoutCover = signal(false);
  protected readonly sort = signal<AdminSort | null>(null);
  /** Keys of the selected items. Cleared whenever the list changes, so a bulk action never reaches a row that is out of sight. */
  protected readonly selection = signal<ReadonlySet<string>>(new Set());
  private readonly selectedLibraryId = signal<string | undefined>(undefined);
  /** The library commission has two views, shown one at a time: its books, and its structure (the tree editor). */
  protected readonly libraryView = signal<'books' | 'structure'>('books');
  private readonly limit = signal(PAGE_SIZE);

  /** `undefined` until the sign-in state is known. */
  private readonly manageableIds = toSignal(
    combineLatest(this.sections.map(section => section.canManage$)).pipe(
      map(flags => new Set(this.sections.filter((_, index) => flags[index]).map(section => section.id)))));

  protected readonly permissionsKnown = computed(() => this.manageableIds() !== undefined);
  protected readonly cards = computed(() => this.sections.filter(section => this.manageableIds()?.has(section.id)));
  protected readonly section = computed(() => this.cards().find(section => section.id === this.commission()));
  protected readonly isLibrary = computed(() => this.section()?.id === Comissions.BIBLIOTHEQUE);
  protected readonly showStructure = computed(() => this.isLibrary() && this.libraryView() === 'structure');

  // --- library ---
  // The libraries are only loaded (a lot of reads) when the library itself is being managed.
  private readonly libraries = computed(() => this.isLibrary() ? untracked(() => this.injector.get(LibraryRepository)).libraries() : undefined);
  protected readonly libraryOptions = computed(() =>
    (this.libraries() ?? []).map(biblio => ({id: biblio.library.id ?? '', name: biblio.library.name})));
  protected readonly libraryId = computed(() => this.selectedLibraryId() ?? this.libraryOptions()[0]?.id);

  // --- objects ---
  protected readonly collections = computed(() => this.section()?.collections ?? []);
  protected readonly severalCollections = computed(() => this.collections().length > 1);
  private readonly loaded = toSignal(
    toObservable(this.collections).pipe(switchMap(collections => collections.length
      ? combineLatest(collections.map(collection => collection.items$.pipe(startWith(undefined))))
      : of([]))),
    {initialValue: []});

  protected readonly loading = computed(() => this.loaded().some(items => items === undefined));
  protected readonly counts = computed(() => this.collections().map((collection, index) => ({
    collection, count: this.loaded()[index]?.length ?? 0,
  })));
  private readonly filtered = computed(() => {
    const words = plain(this.search()).split(/\s+/).filter(Boolean);
    const collectionId = this.collectionFilter();
    return this.loaded().flatMap(items => items ?? []).filter(item =>
      (!collectionId || item.collectionId === collectionId)
      && (!this.withoutCover() || !item.cover)
      && words.every(word => plain(`${item.name} ${item.ref ?? ''} ${item.categoryName ?? item.categoryId ?? ''} ${item.searchText ?? ''}`).includes(word)));
  });
  private readonly tableRows = computed<AdminRow[]>(() => {
    const labels = new Map(this.collections().map(collection => [collection.id, collection.label]));
    const statusLabels = new Map(this.collections().flatMap(collection => collection.statuses).map(option => [option.value, option.label]));
    return this.filtered().map(item => ({
      item,
      collectionLabel: labels.get(item.collectionId) ?? '',
      categoryLabel: item.categoryName ?? (item.categoryId ? categoryLabel(item.categoryId) : ''),
      statusLabel: item.status ? (statusLabels.get(item.status) ?? item.status) : '',
    }));
  });
  // Sorted before the page is cut: the order concerns the whole list, not only what is shown.
  private readonly sortedRows = computed(() => sortRows(this.tableRows(), this.sort()));
  protected readonly rows = computed(() => this.sortedRows().slice(0, this.limit())
    .map(row => ({...row, selected: this.selection().has(row.item.key)})));
  protected readonly selectedCount = computed(() => this.selection().size);
  protected readonly allSelected = computed(() => this.tableRows().length > 0 && this.selection().size === this.tableRows().length);
  protected readonly someSelected = computed(() => this.selection().size > 0 && !this.allSelected());
  protected readonly bulkStatuses = computed(() => this.collections()[0]?.statuses ?? []);
  protected readonly headers = computed(() => {
    const sort = this.sort();
    const columns: ReadonlyArray<{column: AdminSortColumn; label: string; iconOnly?: boolean}> = [
      {column: 'cover', label: 'Couverture', iconOnly: true},
      {column: 'name', label: 'Nom'},
      ...(this.severalCollections() ? [{column: 'collection' as const, label: 'Type'}] : []),
      {column: 'category', label: 'Catégorie'},
      {column: 'ref', label: 'Réf.'},
      {column: 'status', label: 'Statut'},
    ];
    return columns.map(header => {
      const active = sort?.column === header.column;
      return {
        ...header,
        ariaSort: active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : null,
        icon: active ? (sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more',
      };
    });
  });
  protected readonly remaining = computed(() => Math.max(0, this.filtered().length - this.limit()));
  protected readonly nextPageSize = computed(() => Math.min(PAGE_SIZE, this.remaining()));
  protected readonly resultLabel = computed(() => countLabel(this.filtered().length));

  constructor() {
    // Each commission starts with a clean list.
    effect(() => {
      this.commission();
      untracked(() => {
        this.search.set('');
        this.collectionFilter.set(null);
        this.withoutCover.set(false);
        this.sort.set(null);
        this.libraryView.set('books');
        this.selection.set(new Set());
        this.limit.set(PAGE_SIZE);
      });
    });
  }

  protected sortBy(column: AdminSortColumn): void {
    this.sort.update(current => nextSort(current, column));
    this.limit.set(PAGE_SIZE);
  }

  protected setSearch(value: string): void {
    this.search.set(value);
    this.selection.set(new Set());
    this.limit.set(PAGE_SIZE);
  }

  protected setCollection(collectionId: string | null): void {
    this.collectionFilter.set(collectionId);
    this.selection.set(new Set());
    this.limit.set(PAGE_SIZE);
  }

  protected toggleWithoutCover(): void {
    this.withoutCover.update(value => !value);
    this.selection.set(new Set());
    this.limit.set(PAGE_SIZE);
  }

  protected toggleSelected(key: string): void {
    this.selection.update(current => {
      const next = new Set(current);
      if (!next.delete(key)) {
        next.add(key);
      }
      return next;
    });
  }

  /** Selects every row of the list as filtered (not only the page shown), or none when they all are. */
  protected toggleAll(): void {
    this.selection.set(this.allSelected() ? new Set() : new Set(this.tableRows().map(row => row.item.key)));
  }

  protected clearSelection(): void {
    this.selection.set(new Set());
  }

  protected async changeStatus(status: string, label: string): Promise<void> {
    const count = await this.applyToSelection((collection, items) => collection.setStatus(items, status));
    if (count) {
      this.snackBar.open(`${count} objet(s) passé(s) à « ${label} »`, 'Fermer', {duration: 4000});
    }
  }

  protected async deleteSelected(): Promise<void> {
    const count = this.selection().size;
    const confirmation = this.dialog.open(ConfirmationModal, {
      maxWidth: '400px',
      data: {
        title: `Supprimer ${count} objet(s) ?`,
        confirmText: `Cette action supprime définitivement les ${count} objet(s) sélectionné(s).`,
        confirmLabel: 'Supprimer',
      } satisfies ConfirmationData,
    });
    if (await firstValueFrom(confirmation.afterClosed())) {
      if (await this.applyToSelection((collection, items) => collection.removeMany(items))) {
        this.snackBar.open(`${count} objet(s) supprimé(s)`, 'Fermer', {duration: 4000});
      }
    }
  }

  /** The whole list as filtered and sorted (not only the page shown), as a CSV download. */
  protected exportCsv(): void {
    const several = this.severalCollections();
    const columns: ReadonlyArray<CsvColumn> = [
      {header: 'Nom', value: row => row.item.name},
      ...(several ? [{header: 'Type', value: (row: AdminRow) => row.collectionLabel}] : []),
      {header: 'Catégorie', value: row => row.categoryLabel},
      {header: 'Référence', value: row => row.item.ref ?? ''},
      {header: 'Statut', value: row => row.statusLabel},
      {header: 'Couverture', value: row => row.item.cover ?? ''},
    ];
    const blob = new Blob([toCsv(this.sortedRows(), columns)], {type: 'text/csv;charset=utf-8'});
    const link = this.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `catalogue-${this.commission()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /** Runs a bulk action once per collection involved, on the selected items of that collection, then clears the selection. */
  private async applyToSelection(action: (collection: AdminCollection, items: ReadonlyArray<AdminItem>) => Promise<void>): Promise<number> {
    const selected = this.tableRows().map(row => row.item).filter(item => this.selection().has(item.key));
    try {
      for (const collection of this.collections()) {
        const items = selected.filter(item => item.collectionId === collection.id);
        if (items.length) {
          await action(collection, items);
        }
      }
      this.selection.set(new Set());
      return selected.length;
    } catch (error) {
      console.error('Bulk action failed', error);
      this.snackBar.open('Action impossible : vérifiez votre connexion et vos droits', 'Fermer', {duration: 8000});
      return 0;
    }
  }

  protected showView(view: 'books' | 'structure'): void {
    this.libraryView.set(view);
    this.selection.set(new Set());
  }

  protected selectLibrary(libraryId: string): void {
    this.selectedLibraryId.set(libraryId);
  }

  protected showMore(): void {
    this.limit.update(limit => limit + PAGE_SIZE);
  }

  protected add(collection: AdminCollection): void {
    this.openForm({collection});
  }

  protected edit(item: AdminItem): void {
    const collection = this.collections().find(candidate => candidate.id === item.collectionId);
    if (collection) {
      this.openForm({collection, item});
    }
  }

  private openForm(data: AdminItemDialogData): void {
    this.dialog.open(AdminItemDialog, {data, ...ADMIN_DIALOG_CONFIG});
  }
}
