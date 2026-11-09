import {Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, input} from '@angular/core';
import {Author, Biblio, SelectorView, ViewMode} from 'src/app/models/author.model';
import { MatIcon } from '@angular/material/icon';
import { AlphabetComponent } from '../common/alphabet/alphabet.component';
import { AuthorRowComponent } from './author-row/author-row.component';

@Component({
    selector: 'app-authors-view',
    templateUrl: './authors-view.component.html',
    styleUrls: ['./authors-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, AlphabetComponent, AuthorRowComponent]
})
export class AuthorsViewComponent implements OnInit {

  readonly biblio = input.required<Biblio>();

  readonly authors = input.required<Array<Author>>();

  @Output() sendView = new EventEmitter<SelectorView>();

  constructor() { }

  ngOnInit(): void {
  }

  public select(selectorView: SelectorView) {
    this.sendView.emit(selectorView);
  }

  selectLibrary(id: string | undefined) {
    if (id) {
      this.sendView.emit({mode: ViewMode.BY_LIBRARY, id: id});
    }
  }

}
