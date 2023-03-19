import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Author, Biblio, SelectorView, ViewMode} from 'src/app/models/author.model';

@Component({
  selector: 'app-authors-view',
  templateUrl: './authors-view.component.html',
  styleUrls: ['./authors-view.component.scss']
})
export class AuthorsViewComponent implements OnInit {

  @Input()
  biblio!: Biblio;

  @Input()
  authors!: Array<Author>;

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
