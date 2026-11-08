import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Observable} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';

@Component({
    selector: 'app-board-games',
    templateUrl: './board-games.component.html',
    styleUrls: ['./board-games.component.scss'],
    standalone: false
})
export class BoardGamesComponent {
  library$: Observable<Library> = this.firebaseDatabase.boardGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService,
              public toolsService: ToolsService) { }
}
