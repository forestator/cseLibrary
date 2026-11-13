import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, input, Injector, signal, untracked} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {combineLatest, map, of, startWith, switchMap} from 'rxjs';
import {LibraryRepository} from '../../bibliotheque/services/library.repository';
import {SettingsViewComponent} from '../../bibliotheque/components/settings-view/settings-view.component';
import {BadgeComponent} from '../../common/components/book-badge/badge.component';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../catalogue/models/count-label';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {Comissions} from '../../models/common.model';
import {AdminCollection, AdminItem} from './admin-collection.model';
import {ADMIN_DIALOG_CONFIG} from '../admin-dialog.config';
import {AdminItemDialog, AdminItemDialogData} from '../form/admin-item-dialog';
import {AdminCollections} from './admin-collections';

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
  imports: [BadgeComponent, CataloguePageHeader, MatButton, MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger,
    NgOptimizedImage, RouterLink, SettingsViewComponent],
})
export class AdminCatalogue {
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);
  private readonly sections = inject(AdminCollections).sections;

  /** Bound from the route: the commission being managed, if any. */
  readonly commission = input<string>();

  protected readonly search = signal('');
  protected readonly collectionFilter = signal<string | null>(null);
  protected readonly withoutCover = signal(false);
  private readonly selectedLibraryId = signal<string | undefined>(undefined);
  private readonly limit = signal(PAGE_SIZE);

  /** `undefined` until the sign-in state is known. */
  private readonly manageableIds = toSignal(
    combineLatest(this.sections.map(section => section.canManage$)).pipe(
      map(flags => new Set(this.sections.filter((_, index) => flags[index]).map(section => section.id)))));

  protected readonly permissionsKnown = computed(() => this.manageableIds() !== undefined);
  protected readonly cards = computed(() => this.sections.filter(section => this.manageableIds()?.has(section.id)));
  protected readonly section = computed(() => this.cards().find(section => section.id === this.commission()));
  protected readonly isLibrary = computed(() => this.section()?.id === Comissions.BIBLIOTHEQUE);

  // --- library ---
  // The libraries are only loaded (a lot of reads) when the library itself is being managed.
  private readonly libraries = computed(() => this.isLibrary() ? this.injector.get(LibraryRepository).libraries() : undefined);
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
      && words.every(word => plain(`${item.name} ${item.ref ?? ''} ${item.categoryId ?? ''}`).includes(word)));
  });
  protected readonly rows = computed(() => {
    const labels = new Map(this.collections().map(collection => [collection.id, collection.label]));
    return this.filtered().slice(0, this.limit()).map(item => ({
      item,
      collectionLabel: labels.get(item.collectionId) ?? '',
      categoryLabel: item.categoryId ? categoryLabel(item.categoryId) : '',
    }));
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
        this.limit.set(PAGE_SIZE);
      });
    });
  }

  protected setSearch(value: string): void {
    this.search.set(value);
    this.limit.set(PAGE_SIZE);
  }

  protected setCollection(collectionId: string | null): void {
    this.collectionFilter.set(collectionId);
    this.limit.set(PAGE_SIZE);
  }

  protected toggleWithoutCover(): void {
    this.withoutCover.update(value => !value);
    this.limit.set(PAGE_SIZE);
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
