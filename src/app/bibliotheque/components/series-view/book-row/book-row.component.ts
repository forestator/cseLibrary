import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Biblio, Book, Category} from '../../../../models/author.model';
import {BadgeComponent} from '../../../../common/components/book-badge/badge.component';
import {authorNames, publisherName} from '../../../models/library-queries';
import {BookCoverPipe} from '../../../pipes/book-cover.pipe';

interface BookInfo {
  label: string;
  value?: string;
}

// An absent value is displayed like an empty one; only an explicitly empty string hides the line.
function isDisplayed(value?: string): boolean {
  return value?.length !== 0;
}

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrl: './book-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, BookCoverPipe],
})
export class BookRowComponent {
  readonly book = input.required<Book>();
  readonly category = input<Category>();
  readonly index = input.required<number>();
  readonly biblio = input.required<Biblio>();

  /** Odd rows show the cover on the right. */
  protected readonly isReversed = computed(() => this.index() % 2 !== 0);

  protected readonly badge = computed(() => {
    const name = this.category()?.name;
    return name === 'Science fiction' ? 'S.F.' : name;
  });

  protected readonly authors = computed(() => authorNames(this.book().authorIds, this.biblio()));

  protected readonly infos = computed<Array<BookInfo>>(() => {
    const book = this.book();
    const infos: Array<BookInfo> = [
      {label: 'TOME', value: book.tome},
      {label: 'ISNB10', value: book.isbn10},
      {label: 'ISNB13', value: book.isbn13},
      {label: 'Editeur', value: publisherName(book.publisherId, this.biblio())},
      {label: 'Format', value: book.format},
      {label: 'Page', value: book.page},
      {label: 'Achat', value: book.year},
      {label: 'Repère', value: book.ref},
    ];
    // The publisher line is always shown, even without publisher.
    return infos.filter(info => info.label === 'Editeur' || isDisplayed(info.value));
  });
}
