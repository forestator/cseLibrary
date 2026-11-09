import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
  private firebaseDatabase = inject(FirebaseDatabaseService);
  tools = inject(ToolsService);

  library$: Observable<Library | null> = this.firebaseDatabase.videoGamesLibrary$;
}
