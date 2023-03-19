import {Component, OnInit} from '@angular/core';
import {Biblio, Book, Category, Series, SeriesStatus} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/biblio/data.service';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {map, mergeMap, Observable} from 'rxjs';
import {Params, Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {BiblioDatabaseService} from '../../services/biblio-database.service';

@Component({
  selector: 'app-series-view',
  templateUrl: './series-view.component.html',
  styleUrls: ['./series-view.component.scss']
})
export class SeriesViewComponent implements OnInit {

  biblio$!: Observable<Biblio>;

  category$!: Observable<Category>;

  series$!: Observable<Series>;

  book!: Book;

  constructor(public dataService: DataService,
              private navigationService: NavigationService,
              private biblioDatabaseService: BiblioDatabaseService,
              private router: Router,
              public tools: ToolsService) {
  }

  ngOnInit(): void {
    this.biblio$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => this.biblioDatabaseService.getBiblio(params['libraryId']!))
    );
    this.category$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => this.biblioDatabaseService.getBiblio(params['libraryId']!)
        .pipe(map(biblio => biblio.library?.categories?.find(cat => cat.id === params['catId']!)))
      )
    );
    this.series$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => this.biblioDatabaseService.getBiblio(params['libraryId']!)
        .pipe(map(biblio => {
          const cat = biblio.library?.categories?.find(cat => cat.id === params['catId']!);
          const series = cat.series?.find(serie => serie.id === params['seriesId']!);
          if (series?.status === SeriesStatus.ONE_SHOT) {
            series.books = series.books?.reverse();
          }
          return series;
        }))
      )
    );
  }

  selectCategory(libId: string | undefined, id: string | undefined) {
    this.router.navigateByUrl(`/bibliotheque/${libId}/${id}`);
  }

  selectLibrary(id: string | undefined) {
    this.router.navigateByUrl(`/bibliotheque/${id}`);
  }
}


