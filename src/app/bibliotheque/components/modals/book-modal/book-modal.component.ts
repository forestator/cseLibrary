import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  Author,
  Biblio,
  Book,
  BookStatus,
  Publisher,
  SearchBookResult,
  Series,
  SeriesStatus,
  ViewBy
} from 'src/app/models/author.model';
import {GoogleBookService} from 'src/app/services/biblio/google-book.service';
import {map, take} from 'rxjs';
import {SearchModalComponent} from '../search-modal/search-modal.component';
import {UntypedFormControl} from '@angular/forms';
import {DataService} from 'src/app/services/biblio/data.service';
import {v4 as uuidv4} from 'uuid';
import {BasicModal} from '../basic-modal';

@Component({
   selector: 'app-book-modal',
   templateUrl: './book-modal.component.html',
   styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent extends BasicModal implements OnInit {

   public parent: Series | Author;

   public allStatus: Array<string> = Object.keys(BookStatus);

   public title = new UntypedFormControl();
   public resume = new UntypedFormControl();
   public isbn10 = new UntypedFormControl();
   public isbn13 = new UntypedFormControl();
   public format = new UntypedFormControl();
   public author = new UntypedFormControl();
   public status = new UntypedFormControl();
   public page = new UntypedFormControl();
   public publisher = new UntypedFormControl();
   public publishedDate = new UntypedFormControl();
   public ref = new UntypedFormControl();
   public tome = new UntypedFormControl();
   public cover = new UntypedFormControl();
   public year = new UntypedFormControl();

   constructor(
      public dialogRef: MatDialogRef<BookModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { parent: Series | Author, book: Book, biblio: Biblio },
      public dataService: DataService,
      public googleBookService: GoogleBookService,
      public dialog: MatDialog) {
      super();
     this.parent = data.parent;
      if (data.book) {
         this.isNew = false;
         this.by = data.book.by;
         this.id = data.book.id;
         this.parentId = data.book.parentId
         this.title.setValue(data.book.name);
         this.resume.setValue(data.book.resume);
         this.isbn10.setValue(data.book.isbn10);
         this.isbn13.setValue(data.book.isbn13);
         this.format.setValue(data.book.format);
         this.author.setValue(this.data.biblio?.authors?.find(item => item.id === data.book.authorIds[0]));
         this.status.setValue(data.book.status);
         this.page.setValue(data.book.page);
         this.publisher.setValue(this.data.biblio?.publishers?.find(item => item.id === data.book.publisherId));
         this.publishedDate.setValue(data.book.date);
         this.ref.setValue(data.book.ref);
         this.tome.setValue(data.book.tome);
         this.year.setValue(data.book.year);
         this.cover.setValue(data.book.cover);
      } else {
         this.isNew = true;
         this.id = uuidv4();
         this.parentId = data.parent.id;
         this.by = data.parent.by;
         this.title.setValue('');
         this.resume.setValue('');
         this.isbn10.setValue('');
         this.isbn13.setValue('');
         this.format.setValue('');
         this.status.setValue(BookStatus.IN_PROJECT);
         this.page.setValue('');
         this.publisher.setValue('');
         this.publishedDate.setValue('');
         this.ref.setValue('');
         let today = new Date();
         this.year.setValue(today.getFullYear());
         this.cover.setValue('NoCover.jpg');
         let authorValue: Author | undefined;
         let tomeValue: number | string;
         if (this.by == ViewBy.BY_SERIES) {
            let series: Series = data.parent as Series;
            authorValue = series.status === SeriesStatus.ONE_SHOT ?
              undefined :
              this.data.biblio?.authors?.find(item => item.id === series.authorIds[0])
            tomeValue = series.status === SeriesStatus.IN_PROGRESS && series.books ? series.books.length + 1 : '';
         } else {
            authorValue = data.parent as Author;
            tomeValue = '';
         }
         this.author.setValue(authorValue);
         this.tome.setValue(tomeValue);
      }
   }

   ngOnInit(): void {
   }

   cancel(): void {
      this.dialogRef.close(false);
   }

   save() {
      console.log('Save', this.formToData());
      this.dialogRef.close(this.formToData());
   }

   protected formToData(): Book {
      return {
         id: this.id,
         parentId: this.parentId,
         by: this.by,
         name: this.title.value,
         status: this.status.value,
         resume: this.resume.value,
         authorIds: [this.author.value.id],
         isbn10: this.isbn10.value,
         isbn13: this.isbn13.value,
         format: this.format.value,
         page: this.page.value,
         publisherId: this.publisher.value.id,
         ref: this.ref.value,
         tome: this.tome.value,
         date: this.publishedDate.value,
         year: this.year.value,
         cover: this.cover.value
      };
   }

   private parseSearchResponse(responseItems: Array<any>): Array<SearchBookResult> {
      let searchBooks: Array<SearchBookResult> = [];
      responseItems.forEach(item => {
         if (item && item.volumeInfo) {
            let searchBook: SearchBookResult = {
               checked: false,
               title: item.volumeInfo.title,
               resume: item.volumeInfo.description,
               authors: item.volumeInfo.authors?item.volumeInfo.authors.toString():'',
               isbn10: item.volumeInfo.industryIdentifiers?.find((elmt: { type: string; identifier: string }) => elmt.type === 'ISBN_10')?.identifier,
               isbn13: item.volumeInfo.industryIdentifiers?.find((elmt: { type: string; identifier: string }) => elmt.type === 'ISBN_13')?.identifier,
               page: item.volumeInfo.pageCount,
               publisher: item.volumeInfo.publisher,
               publishedDate: item.volumeInfo.publishedDate,
               format: '',
               tome: ''
            };
            searchBooks.push(searchBook);
         }
      });
      return searchBooks;
   }

   private openSearchModal(infos: Array<SearchBookResult>, by: string) {
      const dialogRef = this.dialog.open(
         SearchModalComponent, {
         height: '780px',
         width: '1200px',
         data: { by: by, searchResults: infos }
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(`Search dialog result: `, result);
         this.title.setValue(result.title);
         this.resume.setValue(result.resume);
         this.isbn10.setValue(result.isbn10);
         this.isbn13.setValue(result.isbn13);

         let authorTokens: Array<string> = result.authors.trim().split(' ');
         let firstName: string = authorTokens[authorTokens.length - 1];
         let lastName: string = authorTokens.slice(0, authorTokens.length - 1).join(' ');
         console.log('FirstName: ', firstName);
         console.log('LastName: ', lastName);
         this.author.setValue(this.data.biblio?.authors?.find(item =>
            (item.firstName === firstName && item.lastName === lastName) ||
            (item.firstName === lastName && item.lastName === firstName)));
         console.log('this.author: ', this.author.value);
         let publisher: Publisher | undefined;
         if (result.publisher) {
            publisher = this.data.biblio?.publishers?.find(item => item.name === result.publisher.trim());
            console.log('Find publisher', publisher);
         }
         this.publisher.setValue(publisher);
         this.publishedDate.setValue(result.publishedDate);
         this.page.setValue(result.page);

         if (this.cover.value === 'NoCover.jpg' || this.cover.value === '') {
            this.cover.setValue(result.isbn13+'.jpg');
         }
      });
   }

   find(): void {
      console.log('FIND:', this.title.value);
      if (this.isbn13.value) {
         this.googleBookService.getBookByIsbn(this.isbn13.value).pipe(
            map(isbnResponse => {
               if (isbnResponse.items?.length > 0) {
                  let infos: Array<SearchBookResult> = this.parseSearchResponse(isbnResponse.items);
                  console.log('GOOGLE BOOK by isbn: ', infos);
                  this.openSearchModal(infos, `isbn: ${this.isbn13.value}`);
               }
            }),
            take(1)
         ).subscribe();
      } else if (this.title.value) {
         this.googleBookService.getBookByTitle(this.title.value).pipe(
            map(nameResponse => {
               if (nameResponse.items?.length > 0) {
                  let infos: Array<SearchBookResult> = this.parseSearchResponse(nameResponse.items);
                  console.log('GOOGLE BOOK by name: ', infos);
                  this.openSearchModal(infos, `titre: ${this.title.value}`);
               }
            }),
            take(1)
         ).subscribe();
      }
   }
}
