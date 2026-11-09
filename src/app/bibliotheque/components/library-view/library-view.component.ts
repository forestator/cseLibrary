import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ToolsService} from '../../../services/biblio/tools.service';
import {ViewBy} from '../../../models/author.model';
import {CategoryBackgroundPipe} from '../../pipes/category-background.pipe';
import {visibleBookCount} from '../../models/library-queries';
import {LibraryRepository} from '../../services/library.repository';
import {EmptyStateComponent} from '../common/empty-state/empty-state.component';
import {Crumb, PageHeaderComponent} from '../common/page-header/page-header.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrl: './library-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage, MatIcon, CategoryBackgroundPipe, PageHeaderComponent, SkeletonComponent, EmptyStateComponent],
})
export class LibraryViewComponent {
  private readonly repository = inject(LibraryRepository);
  private readonly adminMode = inject(ToolsService).adminMode;

  readonly libraryId = input<string>();

  protected readonly library = computed(() => this.repository.libraryById(this.libraryId())?.library);
  protected readonly crumbs: ReadonlyArray<Crumb> = [{label: 'Bibliothèque', link: '/bibliotheque'}];

  protected readonly facts = computed(() => {
    const library = this.library();
    const categories = library?.categories ?? [];
    return [`${categories.length} catégories`, `${visibleBookCount(categories, this.adminMode)} livres`];
  });

  protected readonly cards = computed(() => {
    const library = this.library();
    return (library?.categories ?? []).map(category => ({
      id: category.id,
      name: category.name,
      resume: category.resume,
      background: category.bg,
      path: library?.path,
      count: visibleBookCount([category], this.adminMode),
      unit: category.by === ViewBy.BY_AUTHOR ? `${category.authors?.length ?? 0} auteurs` : `${category.series?.length ?? 0} séries`,
    }));
  });
}
