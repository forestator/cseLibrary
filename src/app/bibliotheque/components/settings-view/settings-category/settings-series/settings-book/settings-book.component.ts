import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {Biblio, Book} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {BookModalComponent} from '../../../../modals/book-modal/book-modal.component';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { BadgeComponent } from '../../../../../../common/components/book-badge/badge.component';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-settings-book',
    templateUrl: './settings-book.component.html',
    styleUrls: ['./settings-book.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, BadgeComponent, MatIcon, AsyncPipe]
})
export class SettingsBookComponent implements OnInit {
  tools = inject(ToolsService);
  dialog = inject(MatDialog);
  dataService = inject(DataService);


  readonly book = input.required<Book>();

  readonly index = input.required<string>();

  readonly biblio = input.required<Biblio>();

  readonly sendDelete = output<string>();

  ngOnInit(): void {
  }

  public edit($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(
      BookModalComponent, {
        height: 'auto',
        width: '1200px',
        data: {parent: null, book: this.book(), biblio: this.biblio()}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // update book
        const book = this.book();
        book.by = result.by;
        book.name = result.name;
        book.status = result.status;
        book.resume = result.resume;
        book.authorIds = result.authorIds;
        book.isbn10 = result.isbn10;
        book.isbn13 = result.isbn13;
        book.cover = result.cover;
        book.format = result.format;
        book.page = result.page;
        book.publisherId = result.publisherId;
        book.ref = result.ref;
        book.tome = result.tome;
        book.date = result.date;
        book.year = result.year;
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
        data: {id: this.book().id, message: `Voulez vous vraiment supprimer ce livre: ${this.book().name} ?`}
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendDelete.emit(this.book().id);
      }
    });
  }
}
