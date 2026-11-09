import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import {Biblio, Series} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {MatDialog} from '@angular/material/dialog';
import {SeriesModalComponent} from '../../../modals/series-modal/series-modal.component';
import {BookModalComponent} from '../../../modals/book-modal/book-modal.component';
import {DeleteModalComponent} from 'src/app/bibliotheque/components/modals/delete-modal/delete-modal.component';
import {DataService} from 'src/app/services/biblio/data.service';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { SeriesBadgeComponent } from '../../../common/series-badge/series-badge.component';
import { SettingsBookComponent } from './settings-book/settings-book.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-settings-series',
    templateUrl: './settings-series.component.html',
    styleUrls: ['./settings-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, SeriesBadgeComponent, SettingsBookComponent, AsyncPipe]
})
export class SettingsSeriesComponent implements OnInit {
   tools = inject(ToolsService);
   dialog = inject(MatDialog);
   dataService = inject(DataService);


   @Input()
   series!: Series;

   @Input()
   index!: string;

  @Input()
  biblio!: Biblio;

   @Output() sendDelete = new EventEmitter<string>();

   ngOnInit(): void {
   }

   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         SeriesModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { series: this.series, biblio: this.biblio }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            // update book
            this.series.by = result.by;
            this.series.name = result.name;
            this.series.status = result.status;
            this.series.resume = result.resume;
            this.series.authorIds = result.authorIds;
            this.dataService.log();
         }
      });
   }
   public add($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         BookModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { parent: this.series, book: null, biblio: this.biblio }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Add book to series: ${result}`);
         if (result) {
            // add book
            if (!this.series.books) {
               this.series.books = [];
            }
            this.series.books.push(result);
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
         data: { id: this.series.id, message: `Voulez vous vraiment supprimer cette serie: ${this.series.name}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.sendDelete.emit(this.series.id);
         }
      });
   }

   public deleteBook($event: string) {
      let index = this.series?.books?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.series?.books?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
