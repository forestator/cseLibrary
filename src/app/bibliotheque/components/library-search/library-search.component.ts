import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {SearchBox} from '../../../common/components/search-box/search-box';
import {ToolsService} from '../../../services/biblio/tools.service';
import {BookSearchEntry, buildSearchIndex, searchBooks} from '../../models/library-search';
import {BookCoverPipe} from '../../pipes/book-cover.pipe';
import {LibraryRepository} from '../../services/library.repository';

/** Top bar search over the books of the four libraries. */
@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrl: './library-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchBox, NgOptimizedImage, BookCoverPipe],
})
export class LibrarySearchComponent {
  private readonly router = inject(Router);
  private readonly tools = inject(ToolsService);
  private readonly repository = inject(LibraryRepository);

  protected readonly query = signal('');

  private readonly index = computed(() => buildSearchIndex(this.repository.libraries(), this.tools.adminMode));
  protected readonly results = computed(() => searchBooks(this.index(), this.query()));

  protected readonly displayEntry = (entry: BookSearchEntry): string => entry.book.name;

  /** A book of a series opens on the series page; a book hanging under an author opens its author in the category. */
  protected open(entry: BookSearchEntry): void {
    const base = ['/bibliotheque', entry.libraryId, entry.category.id ?? ''];
    if (entry.authorId || !entry.series) {
      this.router.navigate(base, {queryParams: {author: entry.authorId, book: entry.book.id}});
    } else {
      this.router.navigate([...base, entry.series.id ?? ''], {queryParams: {book: entry.book.id}});
    }
  }
}
