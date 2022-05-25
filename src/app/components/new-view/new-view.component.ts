import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Book, BookPath, BookStatus, Category, Library, Series } from 'src/app/models/author.model';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
   selector: 'app-new-view',
   templateUrl: './new-view.component.html',
   styleUrls: ['./new-view.component.scss']
})
export class NewViewComponent implements OnInit {
   @Input()
   library!: Library | undefined;

   books!: Array<BookPath>;
   booksInProject!: Array<BookPath>;

   constructor() { }

   ngOnInit(): void {
      // build new books list
      this.findNewBooks(this.library).pipe(
         map(newBooks => {
            this.books = newBooks.new;
            this.booksInProject = newBooks.inProject;
         }),
         take(1)
      ).subscribe();
   }

   private findNewBooks(library: Library | undefined): Observable<{ new: Array<BookPath>, inProject: Array<BookPath> }> {
      // find book, series and category
      return new Observable<{ new: Array<BookPath>, inProject: Array<BookPath> }>(observer => {
         const books: Array<BookPath> = [];
         library?.categories?.forEach(c => {
            c.series?.forEach(s => {
               s.books?.forEach(b => {
                  if (b.status === BookStatus.NEW) {
                     books.push({ category: c, series: s, book: b });
                  }
               })
            })
         })
         const booksInProject: Array<BookPath> = [];
         library?.categories?.forEach(c => {
            c.series?.forEach(s => {
               s.books?.forEach(b => {
                  if (b.status === BookStatus.IN_PROJECT) {
                     booksInProject.push({ category: c, series: s, book: b });
                  }
               })
            })
         })
         observer.next({ new: books, inProject: booksInProject });
      });
   }

   exportNewsAsPDF() {
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      //let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
      this.convert(this.books, 0, pdf);
   }

   convert(bookPaths: Array<BookPath>, index: number, pdf: jspdf) {
      let currentBook: BookPath = bookPaths[index];
      let data = document.getElementById(currentBook.book?.id as string);
      if (data) {
         html2canvas(data).then(canvas => {
            const contentDataURL = canvas.toDataURL('image/jpeg')  // 'image/jpeg' for lower quality output.
            const imgProps = pdf.getImageProperties(contentDataURL);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            if (index === 0) {
               pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            } else {
               let page = pdf.addPage('a4', 'l');
               page.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }
            //next
            if (index < bookPaths.length-1) {
               // next
               this.convert(bookPaths, index + 1, pdf);
            } else {
               // finish
               pdf.save('ImaginaireNew.pdf');
            }
         });
      }
   }
}
