import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {AsyncPipe, DOCUMENT} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {BookStatus} from '../../../models/author.model';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import {booksWithStatus, countLabel} from '../../models/library-queries';
import {prepareForCapture} from '../../models/pdf-capture';
import {LibraryRepository} from '../../services/library.repository';
import {EmptyStateComponent} from '../common/empty-state/empty-state.component';
import {PageHeaderComponent} from '../common/page-header/page-header.component';
import {SkeletonComponent} from '../common/skeleton/skeleton.component';
import {BookRowComponent} from '../series-view/book-row/book-row.component';

@Component({
  selector: 'app-new-view',
  templateUrl: './new-view.component.html',
  styleUrl: './new-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, BookRowComponent, AsyncPipe, PageHeaderComponent, SkeletonComponent, EmptyStateComponent],
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

  /** Libraries with something to show; the empty ones would only add noise. */
  protected readonly sections = computed(() =>
    this.newBooks()
      ?.filter(entry => entry.books.length > 0 || entry.booksInProject.length > 0)
      .map(entry => ({
        ...entry,
        newLabel: countLabel(entry.books.length, 'nouveauté'),
        projectLabel: countLabel(entry.booksInProject.length, 'livre'),
      }))
  );

  protected readonly exporting = signal(false);

  protected async exportNewsAsPDF(): Promise<void> {
    this.exporting.set(true);
    try {
      await this.exportPdf();
    } finally {
      this.exporting.set(false);
    }
  }

  private async exportPdf(): Promise<void> {
    const bookIds = (this.newBooks() ?? []).flatMap(entry => entry.books.map(path => path.book.id));
    if (!bookIds.length) {
      return;
    }
    // Heavy libraries are only needed by this admin action.
    const [{default: Pdf}, {default: html2canvas}] = await Promise.all([import('jspdf'), import('html2canvas')]);
    const pdf = new Pdf('l', 'cm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let isFirstPage = true;
    for (const bookId of bookIds) {
      const element = bookId ? this.document.getElementById(bookId) : null;
      if (!element) {
        continue;
      }
      const canvas = await html2canvas(element, {useCORS: true, scale: 2, onclone: prepareForCapture});
      const imageData = canvas.toDataURL('image/jpeg');
      const imageProperties = pdf.getImageProperties(imageData);
      // Cards with an open resume can be taller than a page: shrink them to fit.
      const ratio = imageProperties.height / imageProperties.width;
      const pdfWidth = Math.min(pageWidth, pageHeight / ratio);
      if (!isFirstPage) {
        pdf.addPage('a4', 'l');
      }
      pdf.addImage(imageData, 'JPEG', (pageWidth - pdfWidth) / 2, 0, pdfWidth, pdfWidth * ratio);
      isFirstPage = false;
    }
    if (!isFirstPage) {
      pdf.save('ImaginaireNew.pdf');
    }
  }
}
