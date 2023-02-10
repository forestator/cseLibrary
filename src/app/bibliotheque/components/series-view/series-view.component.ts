import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Book, Category, Library, SelectorView, Series, SeriesStatus, ViewMode} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';

@Component({
  selector: 'app-series-view',
  templateUrl: './series-view.component.html',
  styleUrls: ['./series-view.component.scss']
})
export class SeriesViewComponent implements OnInit {

  @Input()
  library!: Library | undefined;

  @Input()
  category!: Category | undefined;

  @Input()
  series!: Series | undefined;

  @Input()
  book!: Book | undefined;

  @Output() sendView = new EventEmitter<SelectorView>();

  constructor(public dataService: DataService, public tools: ToolsService) { }

  ngOnInit(): void {
    if (this.series?.status === SeriesStatus.ONE_SHOT) {
      this.series.books = this.series.books?.reverse();
    }
    if (this.book && this.book.id){
      const target: HTMLElement | null = document.getElementById(this.book.id);
      if (target) {
        target.scrollIntoView({behavior: 'smooth'});
      }
    }
  }

  selectCategory(id: string | undefined) {
    this.sendView.emit({mode: ViewMode.BY_CATEGORY, id: id});
  }

  selectLibrary(id: string | undefined) {
    this.sendView.emit({mode: ViewMode.BY_LIBRARY, id: id});
  }
}


