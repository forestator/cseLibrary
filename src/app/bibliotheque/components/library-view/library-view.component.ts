import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {Library} from 'src/app/models/author.model';
import {map, mergeMap, Observable} from 'rxjs';
import { Params, RouterLink } from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {BiblioDatabaseService} from '../../services/biblio-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';
import { AsyncPipe } from '@angular/common';
import { CategoryBackgroundPipe } from '../../pipes/category-background.pipe';

@Component({
    selector: 'app-library-view',
    templateUrl: './library-view.component.html',
    styleUrls: ['./library-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, AsyncPipe, CategoryBackgroundPipe]
})
export class LibraryViewComponent implements OnInit {
  private biblioDatabaseService = inject(BiblioDatabaseService);
  toolsService = inject(ToolsService);
  private navigationService = inject(NavigationService);


  library$!: Observable<Library>;

  ngOnInit() {
    this.library$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => {
          return this.biblioDatabaseService.getBiblio(params['libraryId']!).pipe(
            map(biblio => biblio.library)
          );
        }
      ));
  }
}
