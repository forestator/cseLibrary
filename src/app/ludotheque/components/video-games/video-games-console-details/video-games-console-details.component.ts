import {Component, Input} from '@angular/core';
import {Consoles, VideoGame, VideoGameType} from '../../../../models/videoGames.model';
import {Observable} from 'rxjs';
import {BorrowByComission} from '../../../../admin/models/borrow.model';
import {BorrowDataService} from '../../../../admin/services/borrow-data.service';
import {Comissions} from '../../../../models/common.model';

@Component({
  selector: 'app-video-games-console-details',
  templateUrl: './video-games-console-details.component.html',
  styleUrls: ['./video-games-console-details.component.scss']
})
export class VideoGamesConsoleDetailsComponent {
  videoGameType = VideoGameType;
  @Input() selectedVideoGameId?: string;
  @Input() consoleId?: Consoles;
  @Input() videoGames?: Array<VideoGame> | null;

  ludoBorrowInformations$: Observable<BorrowByComission[]>;

  constructor(private borrowDataService: BorrowDataService) {
    this.ludoBorrowInformations$ = this.borrowDataService.getBorrowsOfComission(Comissions.LUDOTHEQUE);
  }

  trackVideoGame(index: number, item: VideoGame) {
    return item.ref;
  }
}
