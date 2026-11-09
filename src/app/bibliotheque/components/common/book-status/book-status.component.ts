import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {BookStatus} from '../../../../models/author.model';

interface StatusStyle {
  text: string;
  tone: string;
}

const STATUSES: Partial<Record<BookStatus, StatusStyle>> = {
  [BookStatus.NEW]: {text: 'Nouveau', tone: 'chip-info'},
  [BookStatus.AVAILABLE]: {text: 'Disponible', tone: 'chip-success'},
  [BookStatus.DECLASSED]: {text: 'Déclassé', tone: 'chip-warning'},
  [BookStatus.MISSING]: {text: 'Perdu', tone: 'chip-danger'},
  [BookStatus.IN_PROJECT]: {text: 'En projet', tone: 'chip-project'},
};

/** Availability chip of a book, readable in both colour schemes. */
@Component({
  selector: 'app-book-status',
  templateUrl: './book-status.component.html',
  styleUrl: './book-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookStatusComponent {
  readonly status = input.required<BookStatus | string>();

  protected readonly style = computed<StatusStyle>(
    () => STATUSES[this.status() as BookStatus] ?? {text: this.status(), tone: 'chip-neutral'}
  );
}
