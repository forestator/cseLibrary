import { Component } from '@angular/core';
import { map, mergeMap, Observable, take } from 'rxjs';
import { Author, Book, BookPath, Category, Library, Publisher, SelectorView, Series, ViewBy, ViewMode } from './models/author.model';
import { AuthorService } from './services/author.service';
import * as xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublisherService } from './services/publisher.service';
import { LibraryService } from './services/library.service';
import { CategoryService } from './services/category.service';
import { XmlParserService } from './services/xml-parser.service';
import { DataService } from './services/data.service';


@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
   title = 'CseBiblio';
   public viewMode: ViewMode = ViewMode.BY_LIBRARY;
   public VIEW_MODES = ViewMode;
   public VIEW_BY = ViewBy;
   public library: Library | undefined;
   public category: Category | undefined;
   public series: Series | undefined;
   public author: Author | undefined;
   public book: Book | undefined;

   constructor(
      private xmlParser: XmlParserService,
      public dataService: DataService,
      private authorService: AuthorService,
      private publisherService: PublisherService,
      private libraryService: LibraryService,
      private categoryService: CategoryService) {

      this.xmlParser.loadXML('assets/IMG.xml').subscribe(biblio => {
         //   // this.dataService.selectedLib = biblio;
         //   // this.library = biblio.library;
         //   // this.category = this.library?.categories?.[0];
      });

      // console.log('allBiblio', this.dataService.allBiblio);
      this.library = this.dataService.selectedLib?.library;
   }

   selectLibrary(libraryId: string) {
      this.library = this.dataService.selectLibrary(libraryId)?.library;
      this.category = this.library?.categories?.[0];
   }

   selectView(selectorView: SelectorView) {
      this.viewMode = selectorView.mode;
      switch (selectorView.mode) {
         case ViewMode.ADMIN:
            this.category = undefined;
            this.series = undefined;
            this.book = undefined;
            break;
         case ViewMode.BY_LIBRARY:
            this.library = this.dataService.selectLibrary(selectorView.id)?.library;
            this.category = this.library?.categories?.[0];
            this.series = undefined;
            this.book = undefined;
            break;
         case ViewMode.BY_CATEGORY:
            this.category = this.library?.categories?.find(item => item.id === selectorView.id);
            this.series = undefined;
            this.book = undefined;
            break;
         case ViewMode.BY_SERIES:
            this.series = this.category?.series?.find(item => item.id === selectorView.id);
            this.book = undefined;
            break;
         case ViewMode.BY_BOOK:
            // find series and category
            if (selectorView.id) {
               this.findBook(this.library, selectorView.id).pipe(
                  map(finder => {
                     if (finder) {
                        this.category = finder.category;
                        this.series = finder.series;
                        this.book = finder.book;
                     }
                  }),
                  take(1)
               ).subscribe();
            }
            break;
         case ViewMode.BY_AUTHOR:
            // find author
            this.author = this.category?.authors?.find(author => author.id === selectorView.id);
            break;
         case ViewMode.NEW:
            break;
      }
   }

   private findBook(library: Library | undefined, bookId: string): Observable<BookPath | undefined> {
      // find book, series and category
      return new Observable<BookPath | undefined>(observer => {
         if (library && library.categories) {
            for (let ci = 0; ci < library.categories.length; ci++) {
               let c: Category = library.categories[ci];
               if (c.series) {
                  for (let si = 0; si < c.series.length; si++) {
                     let s: Series = c.series[si];
                     if (s.books) {
                        for (let bi = 0; bi < s.books.length; bi++) {
                           let b: Book = s.books[bi];
                           if (b && b.id === bookId) {
                              // book found
                              observer.next({ category: c, series: s, book: b });
                           }
                        }
                     }
                  }
               }
            }
         }
         observer.next(undefined);
      });
   }
}