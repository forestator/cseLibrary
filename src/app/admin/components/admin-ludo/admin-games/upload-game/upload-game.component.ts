import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';
import {UploadFormComponent} from '../../../../../common/components/upload-form/upload-form.component';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {BoardGame} from '../../../../../models/boardGame.model';
import {Game} from '../../../../../models/common.model';
import {FileUpload} from '../../../../../models/fileUpload.model';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {StorageUploadService} from '../../../../../services/firebase/storage-upload.service';

@Component({
  selector: 'app-upload-game',
  templateUrl: './upload-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadFormComponent],
})
export class UploadGameComponent {
  private readonly uploadService = inject(StorageUploadService);
  private readonly bggService = inject(BGGService);

  readonly selectedGame = input<Game>();

  /** BoardGameGeek id of the game, only for board games. */
  private readonly bggId = computed(() => {
    const game = this.selectedGame();
    return game && GamesUtils.libraryIdOfGame(game) === 'boardGames' ? (game as BoardGame).id : undefined;
  });

  private readonly bggCover = toSignal(toObservable(this.bggId).pipe(
    switchMap(bggId => bggId ? this.bggService.gameDetails({...this.selectedGame(), id: bggId} as BoardGame) : of(undefined as BoardGame | undefined))
  ));

  protected readonly defaultImage = computed(() => this.selectedGame()?.cover ?? this.bggCover()?.cover);
  protected readonly uploadDisabled = computed(() => {
    const game = this.selectedGame();
    return !(game?.ref && game.category && game.name);
  });

  protected upload(fileToUpload: FileUpload): void {
    this.uploadService.uploadGameCover(fileToUpload, this.selectedGame());
  }
}
