import {Component} from '@angular/core';
import {Biblio} from 'src/app/models/author.model';
import {ToolsService} from 'src/app/services/biblio/tools.service';
import {Observable} from 'rxjs';
import {NavigationService} from '../../../services/navigation.service';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-library-menu',
  templateUrl: './library-menu.component.html',
  styleUrls: ['./library-menu.component.scss']
})
export class LibraryMenuComponent {

  title: string = 'Cse';
  prefixRoute: string = 'bibliotheque/';
  menu$: Observable<Array<Biblio> | null> = this.firebaseDatabaseService.bibliothequeOneShot$;

  constructor(public firebaseDatabaseService: FirebaseDatabaseService,
              public navService: NavigationService,
              public tools: ToolsService) {
  }
}
