import { Component, OnInit, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {Biblio, Book, Category} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import { BadgeComponent } from '../../../../common/components/book-badge/badge.component';
import { AsyncPipe } from '@angular/common';
import { BookCoverPipe } from '../../../pipes/book-cover.pipe';

@Component({
    selector: 'app-book-row',
    templateUrl: './book-row.component.html',
    styleUrls: ['./book-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BadgeComponent, AsyncPipe, BookCoverPipe]
})
export class BookRowComponent implements OnInit {
  tools = inject(ToolsService);
  dataService = inject(DataService);


  readonly book = input.required<Book>();

  readonly category = input<Category>();

  readonly index = input.required<number>();

  readonly biblio = input.required<Biblio>();

  parity!: boolean;
  badge!: string;

  ngOnInit(): void {
    this.parity = this.index() % 2 === 0;
    const category = this.category();
    if (category) {
      this.badge = category.name === 'Science fiction' ? 'S.F.' : category.name;
    }
  }
}
