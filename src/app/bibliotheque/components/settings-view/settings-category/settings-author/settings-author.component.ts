import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthorModalComponent} from 'src/app/bibliotheque/components/modals/author-modal/author-modal.component';
import {BookModalComponent} from 'src/app/bibliotheque/components/modals/book-modal/book-modal.component';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {SeriesModalComponent} from 'src/app/bibliotheque/components/modals/series-modal/series-modal.component';
import {Author, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';

@Component({
   selector: 'app-settings-author',
   templateUrl: './settings-author.component.html',
   styleUrls: ['./settings-author.component.scss']
})
export class SettingsAuthorComponent implements OnInit {
   @Input()
   author!: Author;

   @Input()
   index!: string;

  @Input()
  library!: Library;

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
         AuthorModalComponent, {
         height: '400px',
         width: '1200px',
         data: { author: this.author }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // update book
            this.author.by = result.by;
            this.author.firstName = result.firstName;
            this.author.lastName = result.lastName;
            this.author.resume = result.resume;
            this.dataService.log();
         }
      });
   }
   public addBook($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         BookModalComponent, {
         height: '780px',
         width: '1200px',
         data: { parent: this.author, book: null, library: this.library}
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.author.books?.push(result);
            this.dataService.log();
         }
      });
   }
   public addSeries($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         SeriesModalComponent, {
         height: '780px',
         width: '1200px',
         data: { parent: this.author, series: null }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.author.series?.push(result);
            this.dataService.log();
         }
      });
   }
   public delete($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         DeleteModalComponent, {
         height: '200px',
         width: '600px',
         data: { id: this.author.id, message: `Voulez vous vraiment supprimer cet auteur: ${this.author.firstName} ${this.author.lastName}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            this.sendDelete.emit(this.author.id);
         }
      });
   }
}


