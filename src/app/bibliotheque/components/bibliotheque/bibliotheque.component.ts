import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ToolsService} from '../../../services/biblio/tools.service';
import {CategoryBackgroundPipe} from '../../pipes/category-background.pipe';
import {countLabel, visibleBookCount} from '../../models/library-queries';
import {LibraryRepository} from '../../services/library.repository';
import {PageHeaderComponent} from '../common/page-header/page-header.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';

@Component({
  selector: 'app-bibliotheque',
  templateUrl: './bibliotheque.component.html',
  styleUrl: './bibliotheque.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage, MatIcon, CategoryBackgroundPipe, PageHeaderComponent, SkeletonComponent],
})
export class BibliothequeComponent {
  private readonly adminMode = inject(ToolsService).adminMode;
  protected readonly libraries = inject(LibraryRepository).libraries;

  protected readonly cards = computed(() =>
    this.libraries()?.map(biblio => {
      const library = biblio.library;
      const categories = library?.categories ?? [];
      return {
        id: library?.id,
        path: library?.path,
        name: library?.name,
        resume: library?.resume,
        cover: categories.find(category => category.bg)?.bg,
        categoryCount: countLabel(categories.length, 'catégorie'),
        bookCount: countLabel(visibleBookCount(categories, this.adminMode), 'livre'),
      };
    })
  );
}
