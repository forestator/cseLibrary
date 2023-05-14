import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game, LudoStatus} from '../../../../../models/common.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {BoardGame} from '../../../../../models/boardGame.model';
import {OpenAiService} from '../../../../../services/open-ai.service';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {FirebaseDatabaseService} from '../../../../../services/firebase/firebase-database.service';

@Component({
  selector: 'app-add-game-modal',
  templateUrl: './add-game-modal.component.html',
  styleUrls: ['./add-game-modal.component.scss']
})
export class AddGameModalComponent {
  gameForm: FormGroup;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddGameModalComponent>,
    public fb: FormBuilder,
    private openAiService: OpenAiService,
    private firebaseDatabaseService: FirebaseDatabaseService,
    private bggService: BGGService,
    @Inject(MAT_DIALOG_DATA) public data: {
      games: Array<Game>, selectedGame?: BoardGame
    },
  ) {
    this.gameForm = this.initForm(this.data.selectedGame);
  }

  private initForm(game?: BoardGame): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.games.some(game => game.ref === control.value);
      const edit = this.data?.selectedGame?.ref === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.fb.group({
      ...game,
      ref: this.fb.control(game?.ref, [Validators.required, uniqRef]),
      name: this.fb.control(game?.name, Validators.required),
      description: this.fb.control(game?.description),
      isNew: this.fb.control(game?.isNew ?? true),
      category: this.fb.control(game?.category, Validators.required),
      libraryId: this.fb.control(game ? GamesUtils.libraryIdOfGame(game) : 'boardGames', Validators.required),
      weight: this.fb.control(game?.weight),
      id: this.fb.control(game?.id),
      cover: this.fb.control(game?.cover),
      maxPlayers: this.fb.control(game?.maxPlayers),
      minAge: this.fb.control(game?.minAge),
      minPlayers: this.fb.control(game?.minPlayers),
      playingTime: this.fb.control(game?.playingTime),
      suggestedPlayAge: this.fb.control(game?.suggestedPlayAge),
      themes: this.fb.control(game?.themes),
      yearPublished: this.fb.control(game?.yearPublished),
      status: this.fb.control(game?.status ?? LudoStatus.AVAILABLE),
    });
  }

  async addGame() {
    if (this.gameForm.valid) {
      const result = await this.firebaseDatabaseService.addGame(this.gameForm.value, this.gameForm.value.libraryId);
      console.log(result);
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  async makeSomeMagic() {
    this.loading = true;
    const detailedGame: BoardGame = await this.bggService.gameDetails(this.gameForm.value).toPromise();
    const description = await this.openAiService.genDescriptionJeu(detailedGame).catch(error => {
      console.warn(error);
    });
    if (description) {
      detailedGame.description = description;
    }
    console.log('openAi description', detailedGame.description);
    this.gameForm.patchValue(detailedGame);
    this.loading = false;
  }

  disableMagic(): boolean {
    return !this.gameForm.get('id').value || !this.gameForm.get('name').value;
  }

  deleteGame() {
    this.firebaseDatabaseService.deleteGame(this.data.selectedGame);
    this.cancel();
  }
}
