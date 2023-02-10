import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Category, Library} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {AuthorModalComponent} from '../modals/author-modal/author-modal.component';
import {CategoryModalComponent} from '../modals/category-modal/category-modal.component';
import {PublisherModalComponent} from '../modals/publisher-modal/publisher-modal.component';

@Component({
   selector: 'app-settings-view',
   templateUrl: './settings-view.component.html',
   styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {

   @Input()
   library!: Library | undefined;


   public categoryDisplayed: Category | undefined;
   public index: number | undefined;

   public isAuthorsDisplayed: boolean;
   public isPublishersDisplayed: boolean;

   constructor(public dialog: MatDialog, public dataService: DataService) {
      this.isAuthorsDisplayed = false;
      this.isPublishersDisplayed = false;
      this.categoryDisplayed = undefined;
   }

   ngOnInit(): void {
   }
   public displayAuthors() {
      this.isAuthorsDisplayed = true;
      this.isPublishersDisplayed = false;
      this.categoryDisplayed = undefined;
   }
   public displayPublishers() {
      this.isAuthorsDisplayed = false;
      this.isPublishersDisplayed = true;
      this.categoryDisplayed = undefined;
   }
   public displayCategory(id: string | undefined) {
      this.index = this.library?.categories?.findIndex(item => item.id === id);
      if (this.index !== undefined) {
         this.categoryDisplayed = this.library?.categories?.find(item => item.id === id);
         this.isAuthorsDisplayed = false;
         this.isPublishersDisplayed = false;
      }
   }
   public edit($event: any) {
      console.log('edit library');
      $event.stopPropagation();
   }
   public addCategory($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         CategoryModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { parent: this.library, category: null }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // add category
            this.library?.categories?.push(result);
            this.dataService.log();
         }
      });

   }
   public addAuthor($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         AuthorModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { parent: this.library, author: null }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // add author
            this.dataService.selectedLib?.authors?.push(result);
            this.dataService.log();
         }
      });
   }
   public addPublisher($event: any) {
      $event.stopPropagation();
      const dialogRef = this.dialog.open(
         PublisherModalComponent, {
         height: 'auto',
         width: '1200px',
         data: { parent: this.library, publisher: null }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            // add author
            this.dataService.selectedLib?.publishers?.push(result);
            this.dataService.log();
         }
      });
   }
   public delete($event: any) {
      $event.stopPropagation();
   }
   public deleteCategory($event: string) {
      let index = this.library?.categories?.findIndex(d => d.id === $event); //find index in your array
      if (index !== undefined) {
         this.library?.categories?.splice(index, 1);//remove element from array
         this.categoryDisplayed = undefined;
         this.index = 0;
      }
      this.dataService.log();
   }

   public deleteAuthor($event: string) {
   }

   public deletePublisher($event: string) {
   }
}


