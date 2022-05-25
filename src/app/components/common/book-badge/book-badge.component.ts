import { Component, Input, OnInit } from '@angular/core';
import { Book, BookStatus, SeriesStatus } from 'src/app/models/author.model';

@Component({
  selector: 'app-book-badge',
  templateUrl: './book-badge.component.html',
  styleUrls: ['./book-badge.component.scss']
})
export class BookBadgeComponent implements OnInit {

  @Input() book!: Book;
  @Input() display: string = 'normal';

  txt!: string;
  bg!: string;
  fg!: string;

  constructor() { }

  ngOnInit(): void {
    switch (this.book.status) {
      case BookStatus.NEW:
        this.txt = 'NOUVEAU';
        this.bg = 'chartreuse';
        this.fg = 'white';
        break;
      case BookStatus.AVAILABLE:
        this.txt = 'DISPONIBLE';
        this.bg = 'green';
        this.fg = 'white';
        break;
      case BookStatus.DECLASSED:
        this.txt = 'DECLASSE';
        this.bg = 'darkorange';
        this.fg = 'white';
        break;
      case BookStatus.MISSING:
        this.txt = 'PERDU!';
        this.bg = 'red';
        this.fg = 'white';
        break;
      case BookStatus.IN_PROJECT:
        this.txt = 'EN PROJET';
        this.bg = 'fuchsia';
        this.fg = 'white';
        break;
      default:       
        this.txt = this.book.status;
        this.bg = 'gray';
        this.fg = 'black';
        break;
    }
  }

}
