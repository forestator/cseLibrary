import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Library} from '../../../models/author.model';
import {Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-video-games',
    templateUrl: './video-games.component.html',
    styleUrls: ['./video-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLinkActive, RouterLink, AsyncPipe]
})
export class VideoGamesComponent {
  library$: Observable<Library | null> = this.firebaseDatabase.videoGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService, public tools: ToolsService) { }
}
