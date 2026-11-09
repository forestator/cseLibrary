import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Library} from '../../../models/author.model';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {Observable} from 'rxjs';
import {ToolsService} from '../../../services/biblio/tools.service';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-board-games',
    templateUrl: './board-games.component.html',
    styleUrls: ['./board-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLinkActive, RouterLink, AsyncPipe]
})
export class BoardGamesComponent {
  library$: Observable<Library> = this.firebaseDatabase.boardGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService,
              public toolsService: ToolsService) { }
}
