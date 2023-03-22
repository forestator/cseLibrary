import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Game} from '../../../../models/common.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {BoardGame} from '../../../../models/boardGame.model';
import {OpenAiService} from '../../../../services/open-ai.service';
import {BGGService} from '../../../../ludotheque/services/bgg.service';
import {GamesUtils} from '../../../../models/gamesUtils';

@Component({
  selector: 'app-add-game-modal',
  templateUrl: './add-game-modal.component.html',
  styleUrls: ['./add-game-modal.component.scss']
})
export class AddGameModalComponent {
  gameForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddGameModalComponent>,
    public fb: FormBuilder,
    private openAiService: OpenAiService,
    private bggService: BGGService,
    @Inject(MAT_DIALOG_DATA) public data: {
      games: Array<Game>
    },
  ) {
    this.gameForm = this.initForm();
  }

  private initForm(game?: BoardGame): FormGroup {
    const uniqRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.games.some(game => game.ref === control.value);
      return exist ? {exist: true} : null;
    };

    console.log(game);

    return this.fb.group({
      ref: this.fb.control(game?.ref, [Validators.required, uniqRef]),
      name: this.fb.control(game?.name, Validators.required),
      description: this.fb.control(game?.description),
      isNew: this.fb.control(true),
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
    });
  }

  addGame() {

  }

  cancel() {
    this.dialogRef.close();
  }

  async makeSomeMagic() {
    const detailedGame: BoardGame = await this.bggService.gameDetails(this.gameForm.value).toPromise();
    detailedGame.description = await this.openAiService.genDescriptionJeu(detailedGame);
    this.gameForm.patchValue(detailedGame);
  }
}
