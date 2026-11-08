import {Component, OnInit} from '@angular/core';
import {Library} from 'src/app/models/author.model';
import {map, mergeMap, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {BiblioDatabaseService} from '../../services/biblio-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';

@Component({
    selector: 'app-library-view',
    templateUrl: './library-view.component.html',
    styleUrls: ['./library-view.component.scss'],
    standalone: false
})
export class LibraryViewComponent implements OnInit {

  library$!: Observable<Library>;

  constructor(private biblioDatabaseService: BiblioDatabaseService,
              public toolsService: ToolsService,
              private navigationService: NavigationService) {
  }

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
