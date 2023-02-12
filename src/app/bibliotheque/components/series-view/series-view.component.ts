import {Component, OnInit} from '@angular/core';
import {Book, Category, Library, Series, SeriesStatus} from 'src/app/models/author.model';
import {DataService} from 'src/app/services/data.service';
import {ToolsService} from 'src/app/services/tools.service';
import {map, Observable} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-series-view',
  templateUrl: './series-view.component.html',
  styleUrls: ['./series-view.component.scss']
})
export class SeriesViewComponent implements OnInit {

  library$!: Observable<Library | undefined>;

  category!: Category | undefined;

  series!: Series | undefined;

  book!: Book | undefined;

  constructor(public dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              public tools: ToolsService) {
  }

  ngOnInit(): void {
    this.library$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
          const lib = this.dataService.allBiblio
            .find(biblio => biblio.library?.id === params.get('libraryId')!)?.library;
          this.category = lib?.categories?.find(cat => cat.id === params.get('catId')!);
          this.series = this.category?.series?.find(serie => serie.id === params.get('seriesId')!);
          if (this.series?.status === SeriesStatus.ONE_SHOT) {
            this.series.books = this.series.books?.reverse();
          }
          if (this.book && this.book.id) {
            this.tools.scrollToId(this.book.id);
          }
          return lib;
        }
      ));
  }

  selectCategory(libId: string | undefined, id: string | undefined) {
    this.router.navigateByUrl(`/bibliotheque/${libId}/${id}`);
  }

  selectLibrary(id: string | undefined) {
    this.router.navigateByUrl(`/bibliotheque/${id}`);
  }
}


