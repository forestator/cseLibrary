import { Component, OnInit, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Biblio, Category, ViewBy} from 'src/app/models/author.model';
import {SeriesModalComponent} from '../../modals/series-modal/series-modal.component';
import {CategoryModalComponent} from '../../modals/category-modal/category-modal.component';
import {DeleteModalComponent} from '../../modals/delete-modal/delete-modal.component';
import {DataService} from 'src/app/services/biblio/data.service';
import {AuthorModalComponent} from '../../modals/author-modal/author-modal.component';
import {BiblioDatabaseService} from '../../../services/biblio-database.service';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { SettingsSeriesComponent } from './settings-series/settings-series.component';
import { SettingsAuthorComponent } from './settings-author/settings-author.component';

@Component({
    selector: 'app-settings-category',
    templateUrl: './settings-category.component.html',
    styleUrls: ['./settings-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, SettingsSeriesComponent, SettingsAuthorComponent]
})
export class SettingsCategoryComponent implements OnInit {
   dialog = inject(MatDialog);
   dataService = inject(DataService);
   private biblioDatabaseService = inject(BiblioDatabaseService);


   readonly category = input.required<Category>();

   readonly index = input.required<number>();

   readonly biblio = input.required<Biblio>();

   readonly sendDelete = output<string>();

   ngOnInit(): void {
   }

   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         CategoryModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { category: this.category() }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // update book
            const category = this.category();
            category.by = result.by;
            category.name = result.name;
            category.resume = result.resume;
            this.dataService.log();
         }
      });
   }
   public add($event: any) {
      $event.stopPropagation();
      const category = this.category();
      if (category.by === ViewBy.BY_SERIES) {
         const dialogRef = this.dialog.open(
            SeriesModalComponent, {
            height: 'auto',
            width: '1200px',
            data: { parent: category, series: null, biblio: this.biblio() }
         });

         dialogRef.afterClosed().subscribe(result => {
            console.log(`Add series: ${result}`);
            if (result) {
               this.category().series?.push(result);
               this.dataService.log();
            }
         });
      } else {
         const dialogRef = this.dialog.open(
            AuthorModalComponent, {
            height: 'auto',
            width: '1200px',
            data: { parent: category, author: null }
         });

         dialogRef.afterClosed().subscribe(result => {
            console.log(`Add author: ${result}`);
            if (result) {
              this.biblioDatabaseService.addAuthor(this.biblio(), result);
            }
         });
      }
   }
   public delete($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         DeleteModalComponent, {
         height: 'auto',
         width: '600px',
         data: { id: this.category().id, message: `Voulez vous vraiment supprimer cette categorie: ${this.category().name}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            this.sendDelete.emit(this.category().id);
         }
      });
   }
   public deleteSeries($event: string) {
      const category = this.category();
      let index = category?.series?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         category?.series?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
   public deleteAuthor($event: string) {
      const category = this.category();
      let index = category?.authors?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         category?.authors?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}


