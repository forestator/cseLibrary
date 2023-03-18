import {Component, OnInit} from '@angular/core';
import {Author, Category, Library, SelectorView, ViewBy} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {DataService} from '../../../services/biblio/data.service';
import {map, mergeMap, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {BiblioDatabaseService} from '../../services/biblio-database.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  library$!: Observable<Library | undefined>;

  public filterLetter?: string;

  category$?: Observable<Category>;
  counter: number = 0;
  VIEW_BY = ViewBy;

  constructor(public tools: ToolsService,
              private navigationService: NavigationService,
              private biblioDatabaseService: BiblioDatabaseService,
              public dataService: DataService) {
  }

  ngOnInit(): void {
    this.library$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => this.biblioDatabaseService.getLibrary(params['libraryId']!))
    );
    console.log(this.library$);
    this.category$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) =>
        this.biblioDatabaseService.getLibrary(params['libraryId']!).pipe(
          map(lib => lib.categories.find(cat => cat.id === params['catId']))
        )
      )
    );
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
