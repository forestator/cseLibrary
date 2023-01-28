import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category, Library, SelectorView, ViewBy, ViewMode} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/tools.service';
import {BoardGameCategory} from '../../models/boardGame.model';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  @Input()
  library!: Library | undefined;

  private _category!: Category | undefined;
  public isBoardGameCategory: boolean = false;
  @Input('category')
  set category(value: Category | undefined) {
    this._category = value;
    if (this._category?.id && this._category.id in BoardGameCategory) {
      this.isBoardGameCategory = true;
    } else {
      this._category?.series?.forEach(s => {
        console.log('counters')
        this.counter += s.books ? s.books.length : 0;
      });
    }
  }

  get category(): Category | undefined {
    return this._category;
  }

  @Output() sendView = new EventEmitter<SelectorView>();

  counter: number = 0;
  VIEW_BY = ViewBy;

  ALPHABET: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor(public tools: ToolsService, public dataService: DataService) {
  }

  ngOnInit(): void {

  }

  selectLibrary(id: string | undefined) {
    if (id) {
      this.sendView.emit({mode: ViewMode.BY_LIBRARY, id: id});
    }
  }

  selectSeries(id: string | undefined) {
    if (id) {
      this.sendView.emit({mode: ViewMode.BY_SERIES, id: id});
    }
  }

  selectAuthor(selectorView: SelectorView) {
    this.sendView.emit(selectorView);
  }

}
