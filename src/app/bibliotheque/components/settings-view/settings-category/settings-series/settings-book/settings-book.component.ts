import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {Biblio, Book} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {BookModalComponent} from '../../../../modals/book-modal/book-modal.component';

@Component({
  selector: 'app-settings-book',
  templateUrl: './settings-book.component.html',
  styleUrls: ['./settings-book.component.scss']
})
export class SettingsBookComponent implements OnInit {

  @Input()
  book!: Book;

  @Input()
  index!: string;

  @Input()
  biblio!: Biblio;

  @Output() sendDelete = new EventEmitter<string>();

  constructor(
    public tools: ToolsService,
    public dialog: MatDialog,
    public dataService: DataService) {
  }

  ngOnInit(): void {
  }

  public edit($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      BookModalComponent, {
        height: 'auto',
        width: '1200px',
        data: {parent: null, book: this.book, biblio: this.biblio}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // update book
        this.book.by = result.by;
        this.book.name = result.name;
        this.book.status = result.status;
        this.book.resume = result.resume;
        this.book.authorIds = result.authorIds;
        this.book.isbn10 = result.isbn10;
        this.book.isbn13 = result.isbn13;
        this.book.cover = result.cover;
        this.book.format = result.format;
        this.book.page = result.page;
        this.book.publisherId = result.publisherId;
        this.book.ref = result.ref;
        this.book.tome = result.tome;
        this.book.date = result.date;
        this.book.year = result.year;
        this.dataService.log();
      }
    });
  }

  public delete($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      DeleteModalComponent, {
        height: 'auto',
        width: '600px',
        data: {id: this.book.id, message: `Voulez vous vraiment supprimer ce livre: ${this.book.name} ?`}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendDelete.emit(this.book.id);
      }
    });
  }
}
