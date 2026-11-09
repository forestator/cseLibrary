import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {SearchBookResult} from '../../../../models/author.model';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatCheckbox, MatButton, MatIconButton, MatIcon],
})
export class SearchModalComponent {
  private readonly dialogRef = inject<MatDialogRef<SearchModalComponent, SearchBookResult>>(MatDialogRef);
  protected readonly data = inject<{by: string; searchResults: ReadonlyArray<SearchBookResult>}>(MAT_DIALOG_DATA);

  protected readonly selectedIndex = signal<number>(-1);

  protected readonly results = this.data.searchResults.map(result => ({
    rows: [
      {label: 'Titre', value: result.title},
      {label: 'Auteurs', value: result.authors},
      {label: 'Résumé', value: result.resume},
      {label: 'ISBN 10', value: result.isbn10},
      {label: 'ISBN 13', value: result.isbn13},
      {label: 'Editeur', value: result.publisher},
      {label: 'Date de publication', value: result.publishedDate},
      {label: 'Nombre de page', value: result.page},
    ],
  }));

  /** At most one result can be selected. */
  protected toggle(index: number, checked: boolean): void {
    this.selectedIndex.set(checked ? index : -1);
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected save(): void {
    this.dialogRef.close(this.data.searchResults[this.selectedIndex()]);
  }
}
