import {Component, OnInit} from '@angular/core';
import {Library} from 'src/app/models/author.model';
import {mergeMap, Observable} from 'rxjs';
import {Params} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {BiblioDatabaseService} from '../../services/biblio-database.service';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrls: ['./library-view.component.scss']
})
export class LibraryViewComponent implements OnInit {

  library$!: Observable<Library>;

  constructor(private biblioDatabaseService: BiblioDatabaseService, private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.library$ = this.navigationService.getRouteParams().pipe(
      mergeMap((params: Params) => {
          return this.biblioDatabaseService.getLibrary(params['libraryId']!);
        }
      ));
  }
}
