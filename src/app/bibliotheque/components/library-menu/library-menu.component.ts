import {Component, OnInit} from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {map, mergeMap, Observable} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent implements OnInit {

  title: string = 'Cse';
  prefixRoute: string = 'bibliotheque/';
  menu$: Observable<Array<Biblio> | null> = this.firebaseDatabaseService.bibliotheque$;
  selectedBiblio$?: Observable<Biblio | undefined>;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              public navService: NavigationService,
              public tools: ToolsService) {
  }

  ngOnInit(): void {
    this.selectedBiblio$ = this.navService.getRouteParams().pipe(mergeMap((params) => {
      const libraryId = params['libraryId'];
      return this.firebaseDatabaseService.bibliotheque$.pipe(
        map(biblio => biblio?.find(b => b?.library?.id === libraryId))
      )
    }));
  }

  public toggleAdminMode() {
    this.tools.adminMode = !this.tools.adminMode;
    this.tools.adminMode$.next(this.tools.adminMode);
    console.log('adminMode', this.tools.adminMode);
  }
}
