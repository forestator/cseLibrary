import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {firstValueFrom, map, Observable} from 'rxjs';
import {Biblio, BookPath, BookStatus, Library} from 'src/app/models/author.model';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {AuthentificationService} from '../../../services/firebase/authentification.service';

@Component({
    selector: 'app-new-view',
    templateUrl: './new-view.component.html',
    styleUrls: ['./new-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NewViewComponent implements OnInit {
  newBooks$?: Observable<{ biblio: Biblio; books: BookPath[]; bookInProject: BookPath[] }[]>;

  constructor(private firebaseDatabaseService: FirebaseDatabaseService, public auth: AuthentificationService) {
  }

  ngOnInit(): void {
    // build new books list
    this.newBooks$ = this.firebaseDatabaseService.bibliothequeOneShot$.pipe(
      map((allBiblio) =>
        allBiblio.map(biblio => {
          const {newBooks, inProject} = this.findNewBooks(biblio.library);
          return {biblio: biblio, books: newBooks, bookInProject: inProject};
        })
      )
    );
  }

  private findNewBooks(library: Library): { newBooks: Array<BookPath>, inProject: Array<BookPath> } {
    // find book, series and category
    const books: Array<BookPath> = [];
    library?.categories?.forEach(c => {
      c.series?.forEach(s => {
        s.books?.forEach(b => {
          if (b.status === BookStatus.NEW) {
            books.push({category: c, series: s, book: b});
          }
        })
      })
    });
    const booksInProject: Array<BookPath> = [];
    library?.categories?.forEach(c => {
      c.series?.forEach(s => {
        s.books?.forEach(b => {
          if (b.status === BookStatus.IN_PROJECT) {
            booksInProject.push({category: c, series: s, book: b});
          }
        })
      })
    });
    return {newBooks: books, inProject: booksInProject};
  }

  async exportNewsAsPDF() {
    let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
    //let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
    const books: Array<BookPath> =
      await firstValueFrom(this.newBooks$).then((newBooks) => {
        const boooks: Array<BookPath> = [];
        newBooks.forEach(newB => newB.books.forEach(book => boooks.push(book)));
        return boooks;
      });
    this.convert(books, 0, pdf);
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
        if (index < bookPaths.length - 1) {
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
