import {Component, OnInit} from '@angular/core';
import {Author, Category, Library, SelectorView, ViewBy} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {DataService} from '../../../services/biblio/data.service';
import {map, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  library$!: Observable<Library | undefined>;

  private _category!: Category | undefined;
  public filterLetter?: string;

  set category(value: Category | undefined) {
    this._category = value;
    this._category?.series?.forEach(s => {
      this.counter += s.books ? s.books.length : 0;
    });
  }

  get category(): Category | undefined {
    return this._category;
  }

  counter: number = 0;
  VIEW_BY = ViewBy;

  constructor(public tools: ToolsService,
              private navigationService: NavigationService,
              public dataService: DataService) {
  }

  ngOnInit(): void {
    this.library$ = this.navigationService.getRouteParams().pipe(
      map((params: Params) => {
          const lib = this.dataService.allBiblio
            .find(biblio => biblio.library?.id === params['libraryId']!)?.library;
          this.category = lib?.categories?.find(cat => cat.id === params['catId']!);
          return lib;
        }
      ));
  }

  selectAuthor(selectorView: SelectorView) {
    // this.sendView.emit(selectorView);
  }

  filterByLetter($event: string) {
    this.filterLetter = $event;
  }

  filterAuthors(authors: Array<Author> | undefined): Array<Author> {
    let filteredAuth: Array<Author> = authors ?? [];
    if (this.filterLetter && authors) {
      filteredAuth = authors.filter(auth =>
        auth.firstName.startsWith(this.filterLetter!) ||
        auth.lastName.startsWith(this.filterLetter!));
    }
    return filteredAuth;
  }
}
