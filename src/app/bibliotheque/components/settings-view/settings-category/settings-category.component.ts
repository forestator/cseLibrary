import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Category, ViewBy} from 'src/app/models/author.model';
import {SeriesModalComponent} from '../../modals/series-modal/series-modal.component';
import {CategoryModalComponent} from '../../modals/category-modal/category-modal.component';
import {DeleteModalComponent} from '../../modals/delete-modal/delete-modal.component';
import {DataService} from 'src/app/services/biblio/data.service';
import {AuthorModalComponent} from '../../modals/author-modal/author-modal.component';

@Component({
   selector: 'app-settings-category',
   templateUrl: './settings-category.component.html',
   styleUrls: ['./settings-category.component.scss']
})
export class SettingsCategoryComponent implements OnInit {

   @Input()
   category!: Category;

   @Input()
   index!: number;

   @Output() sendDelete = new EventEmitter<string>();

   constructor(public dialog: MatDialog, public dataService: DataService) { }

   ngOnInit(): void {
   }

   public edit($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         CategoryModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { category: this.category }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // update book
            this.category.by = result.by;
            this.category.name = result.name;
            this.category.resume = result.resume;
            this.dataService.log();
         }
      });
   }
   public add($event: any) {
      $event.stopPropagation();
      if (this.category.by === ViewBy.BY_SERIES) {
         const dialogRef = this.dialog.open(
            SeriesModalComponent, {
            height: 'auto',
            width: '1200px',
            data: { parent: this.category, series: null }
         });

         dialogRef.afterClosed().subscribe(result => {
            console.log(`Add series: ${result}`);
            if (result) {
               this.category.series?.push(result);
               this.dataService.log();
            }
         });
      } else {
         const dialogRef = this.dialog.open(
            AuthorModalComponent, {
            height: 'auto',
            width: '1200px',
            data: { parent: this.category, author: null }
         });

         dialogRef.afterClosed().subscribe(result => {
            console.log(`Add author: ${result}`);
            if (result) {
               this.category.authors?.push(result);
               this.dataService.selectedLib?.authors?.push(result);
               this.dataService.log();
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
         data: { id: this.category.id, message: `Voulez vous vraiment supprimer cette categorie: ${this.category.name}` }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            this.sendDelete.emit(this.category.id);
         }
      });
   }
   public deleteSeries($event: string) {
      let index = this.category?.series?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.category?.series?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
   public deleteAuthor($event: string) {
      let index = this.category?.authors?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.category?.authors?.splice(index, 1);//remove element from array
      }
      this.dataService.log();
   }
}


