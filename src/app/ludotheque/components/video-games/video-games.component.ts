import {Component} from '@angular/core';
import {Library} from '../../../models/author.model';
import {Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {ToolsService} from '../../../services/biblio/tools.service';

@Component({
  selector: 'app-video-games',
  templateUrl: './video-games.component.html',
  styleUrls: ['./video-games.component.scss']
})
export class VideoGamesComponent {
  library$: Observable<Library | null> = this.firebaseDatabase.videoGamesLibrary$;
  constructor(private firebaseDatabase: FirebaseDatabaseService, public tools: ToolsService) { }
}
