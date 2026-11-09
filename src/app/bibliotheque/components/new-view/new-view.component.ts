import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AsyncPipe} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {BookStatus} from '../../../models/author.model';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {booksWithStatus} from '../../models/library-queries';
import {LibraryRepository} from '../../services/library.repository';
import {BookRowComponent} from '../series-view/book-row/book-row.component';

@Component({
  selector: 'app-new-view',
  templateUrl: './new-view.component.html',
  styleUrl: './new-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, BookRowComponent, AsyncPipe],
})
export class NewViewComponent {
  private readonly libraries = inject(LibraryRepository).libraries;
  private readonly document = inject(DOCUMENT);
  protected readonly auth = inject(AuthentificationService);

  protected readonly newBooks = computed(() =>
    this.libraries()?.map(biblio => ({
      biblio,
      books: booksWithStatus(biblio, BookStatus.NEW),
      booksInProject: booksWithStatus(biblio, BookStatus.IN_PROJECT),
    }))
  );

  protected async exportNewsAsPDF(): Promise<void> {
    const bookIds = (this.newBooks() ?? []).flatMap(entry => entry.books.map(path => path.book.id));
    if (!bookIds.length) {
      return;
    }
    // Heavy libraries are only needed by this admin action.
    const [{default: Pdf}, {default: html2canvas}] = await Promise.all([import('jspdf'), import('html2canvas')]);
    const pdf = new Pdf('l', 'cm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let isFirstPage = true;
    for (const bookId of bookIds) {
      const element = bookId ? this.document.getElementById(bookId) : null;
      if (!element) {
        continue;
      }
      const canvas = await html2canvas(element);
      const imageData = canvas.toDataURL('image/jpeg');
      const imageProperties = pdf.getImageProperties(imageData);
      const pdfHeight = (imageProperties.height * pdfWidth) / imageProperties.width;
      if (!isFirstPage) {
        pdf.addPage('a4', 'l');
      }
      pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      isFirstPage = false;
    }
    if (!isFirstPage) {
      pdf.save('ImaginaireNew.pdf');
    }
  }
}
