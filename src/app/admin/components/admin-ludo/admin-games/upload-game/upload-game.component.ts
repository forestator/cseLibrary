import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Game} from '../../../../../models/common.model';
import {FileUpload} from '../../../../../models/fileUpload.model';
import {StorageUploadService} from '../../../../../services/firebase/storage-upload.service';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {BoardGame} from '../../../../../models/boardGame.model';
import {take} from 'rxjs';

@Component({
  selector: 'app-upload-game',
  templateUrl: './upload-game.component.html',
  styleUrls: ['./upload-game.component.scss']
})
export class UploadGameComponent implements OnChanges {
  @Input() selectedGame?: Game;

  constructor(private uploadService: StorageUploadService,
              private bgg: BGGService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (GamesUtils.libraryIdOfGame(this.selectedGame) === 'boardGames') {
      const selectedBoardGame = this.selectedGame as BoardGame;
      if (selectedBoardGame.id) {
        this.bgg.gameDetails(selectedBoardGame).pipe(take(1)).subscribe(rep => {
          this.selectedGame.cover = rep.cover;
        });
      }
    }
  }

  upload(filteToUpload: FileUpload): void {
    this.uploadService.uploadGameCover(filteToUpload, this.selectedGame);
  }
}
