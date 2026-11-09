import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthorModalComponent} from 'src/app/bibliotheque/components/modals/author-modal/author-modal.component';
import {BookModalComponent} from 'src/app/bibliotheque/components/modals/book-modal/book-modal.component';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {SeriesModalComponent} from 'src/app/bibliotheque/components/modals/series-modal/series-modal.component';
import {Author, Biblio} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { SettingsBookComponent } from '../settings-series/settings-book/settings-book.component';
import { SettingsSeriesComponent } from '../settings-series/settings-series.component';

@Component({
    selector: 'app-settings-author',
    templateUrl: './settings-author.component.html',
    styleUrls: ['./settings-author.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, SettingsBookComponent, SettingsSeriesComponent]
})
export class SettingsAuthorComponent implements OnInit {
   tools = inject(ToolsService);
   dialog = inject(MatDialog);
   dataService = inject(DataService);

   readonly author = input.required<Author>();

   readonly index = input.required<string>();

  readonly biblio = input.required<Biblio>();

   readonly sendDelete = output<string>();

   ngOnInit(): void {
   }
   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         AuthorModalComponent, {
         height: '400px',
         width: '1200px',
         data: { author: this.author() }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // update book
            const author = this.author();
            author.by = result.by;
            author.firstName = result.firstName;
            author.lastName = result.lastName;
            author.resume = result.resume;
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
         data: { parent: this.author(), book: null, biblio: this.biblio()}
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.author().books?.push(result);
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
         data: { parent: this.author(), series: null, biblio: this.biblio() }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.author().series?.push(result);
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
         data: { id: this.author().id, message: `Voulez vous vraiment supprimer cet auteur: ${this.author().firstName} ${this.author().lastName}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            this.sendDelete.emit(this.author().id);
         }
      });
   }
}


