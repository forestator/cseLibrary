import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {combineLatest, map, startWith} from 'rxjs';
import {BadgeComponent} from '../../common/components/book-badge/badge.component';
import {CataloguePageHeader} from '../../catalogue/components/catalogue-page-header/catalogue-page-header';
import {countLabel} from '../../catalogue/models/count-label';
import {categoryLabel} from '../../ludotheque/pipes/game-category-label.pipe';
import {AdminCollection, AdminItem} from './admin-collection.model';
import {AdminCollections} from './admin-collections';

const PAGE_SIZE = 100;

function plain(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** Global administration: every object of every commission in one searchable list. */
@Component({
  selector: 'app-admin-catalogue',
  templateUrl: './admin-catalogue.html',
  styleUrl: './admin-catalogue.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, CataloguePageHeader, MatButton, MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger, NgOptimizedImage],
})
export class AdminCatalogue {
  protected readonly collections = inject(AdminCollections).collections;

  protected readonly search = signal('');
  protected readonly collectionFilter = signal<string | null>(null);
  protected readonly withoutCover = signal(false);
  private readonly limit = signal(PAGE_SIZE);

  /** `undefined` while a collection is loading. */
  private readonly loaded = toSignal(
    combineLatest(this.collections.map(collection => collection.items$.pipe(startWith(undefined)))),
    {initialValue: this.collections.map(() => undefined as AdminItem[] | undefined)});
  private readonly manageableIds = toSignal(
    combineLatest(this.collections.map(collection => collection.canManage$.pipe(startWith(false)))).pipe(
      map(flags => new Set(this.collections.filter((_, index) => flags[index]).map(collection => collection.id)))),
    {initialValue: new Set<string>()});

  protected readonly loading = computed(() => this.loaded().some(items => items === undefined));
  protected readonly manageable = computed(() => this.collections.filter(collection => this.manageableIds().has(collection.id)));

  private readonly allItems = computed(() => this.loaded().flatMap(items => items ?? []));
  protected readonly counts = computed(() => this.collections.map((collection, index) => ({
    collection, count: this.loaded()[index]?.length ?? 0,
  })));

  private readonly filtered = computed(() => {
    const words = plain(this.search()).split(/\s+/).filter(Boolean);
    const collectionId = this.collectionFilter();
    return this.allItems().filter(item =>
      (!collectionId || item.collectionId === collectionId)
      && (!this.withoutCover() || !item.cover)
      && words.every(word => plain(`${item.name} ${item.ref ?? ''} ${item.categoryId ?? ''}`).includes(word)));
  });
  protected readonly rows = computed(() => {
    const labels = new Map(this.collections.map(collection => [collection.id, collection.label]));
    return this.filtered().slice(0, this.limit()).map(item => ({
      item,
      collectionLabel: labels.get(item.collectionId) ?? '',
      categoryLabel: item.categoryId ? categoryLabel(item.categoryId) : '',
      editable: this.manageableIds().has(item.collectionId),
    }));
  });
  protected readonly remaining = computed(() => Math.max(0, this.filtered().length - this.limit()));
  protected readonly resultLabel = computed(() => countLabel(this.filtered().length));

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

  protected showMore(): void {
    this.limit.update(limit => limit + PAGE_SIZE);
  }

  protected add(collection: AdminCollection): void {
    void collection.add();
  }

  protected edit(item: AdminItem): void {
    void this.collections.find(collection => collection.id === item.collectionId)?.edit(item);
  }
}
