import {NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Biblio, Book, Category} from '../../../../models/author.model';
import {authorNames, publisherName} from '../../../models/library-queries';
import {BookCoverPipe} from '../../../pipes/book-cover.pipe';
import {BookStatusComponent} from '../../common/book-status/book-status.component';

interface BookInfo {
  label: string;
  value?: string;
}

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrl: './book-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, BookStatusComponent, BookCoverPipe],
})
export class BookRowComponent {
  readonly book = input.required<Book>();
  readonly category = input<Category>();
  readonly biblio = input.required<Biblio>();
  readonly highlighted = input(false);
  readonly resumeOpen = input(false);
  /** The PDF export needs every cover already loaded. */
  readonly eagerCover = input(false);
  /** Marks the cover as the page's main image so it loads first. */
  readonly priorityCover = input(false);

  // NgOptimizedImage forbids an explicit `loading` together with `priority`.
  protected readonly loading = computed(() => (this.priorityCover() ? undefined : this.eagerCover() ? 'eager' : 'lazy'));

  protected readonly badge = computed(() => {
    const name = this.category()?.name;
    return name === 'Science fiction' ? 'S.F.' : name;
  });

  protected readonly authors = computed(() => authorNames(this.book().authorIds, this.biblio()));

  protected readonly infos = computed<Array<BookInfo>>(() => {
    const book = this.book();
    const infos: Array<BookInfo> = [
      {label: 'Tome', value: book.tome},
      {label: 'ISBN 10', value: book.isbn10},
      {label: 'ISBN 13', value: book.isbn13},
      {label: 'Éditeur', value: publisherName(book.publisherId, this.biblio())},
      {label: 'Format', value: book.format},
      {label: 'Pages', value: book.page},
      {label: "Année d'achat", value: book.year},
      {label: 'Repère', value: book.ref},
    ];
    return infos.filter(info => !!info.value);
  });
}
