import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Library, SelectorView, ViewMode} from 'src/app/models/author.model';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrls: ['./library-view.component.scss']
})
export class LibraryViewComponent implements OnInit {

  @Input()
  library!: Library | undefined;

  @Output() sendView = new EventEmitter<SelectorView>();

  constructor() { }

  ngOnInit(): void {
  }

  selectCategory(id: string | undefined) {
    this.sendView.emit({mode: ViewMode.BY_CATEGORY, id: id});
  }
}
