import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
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


   readonly series = input.required<Series>();

   readonly index = input.required<string>();

  readonly biblio = input.required<Biblio>();

   readonly sendDelete = output<string>();

   ngOnInit(): void {
   }

   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         SeriesModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { series: this.series(), biblio: this.biblio() }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            // update book
            const series = this.series();
            series.by = result.by;
            series.name = result.name;
            series.status = result.status;
            series.resume = result.resume;
            series.authorIds = result.authorIds;
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
         data: { parent: this.series(), book: null, biblio: this.biblio() }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Add book to series: ${result}`);
         if (result) {
            // add book
            const series = this.series();
            if (!series.books) {
               series.books = [];
            }
            series.books.push(result);
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
         data: { id: this.series().id, message: `Voulez vous vraiment supprimer cette serie: ${this.series().name}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         if (result) {
            this.sendDelete.emit(this.series().id);
         }
      });
   }

   public deleteBook($event: string) {
      const series = this.series();
      let index = series?.books?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         series?.books?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}
