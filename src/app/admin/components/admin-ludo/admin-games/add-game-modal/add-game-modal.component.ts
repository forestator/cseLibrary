import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {firstValueFrom, startWith} from 'rxjs';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {GamesRepository} from '../../../../../ludotheque/services/games.repository';
import {BoardGame} from '../../../../../models/boardGame.model';
import {Game, LibraryId} from '../../../../../models/common.model';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {OpenAiService} from '../../../../../services/open-ai.service';
import {AddGameFormComponent} from '../add-game-form/add-game-form.component';

@Component({
  selector: 'app-add-game-modal',
  templateUrl: './add-game-modal.component.html',
  styleUrl: './add-game-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, AddGameFormComponent, MatDialogActions, MatButton,
    MatProgressBar, MatIcon],
})
export class AddGameModalComponent {
  private readonly dialogRef = inject<MatDialogRef<AddGameModalComponent>>(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly openAiService = inject(OpenAiService);
  private readonly repository = inject(GamesRepository);
  private readonly bggService = inject(BGGService);
  protected readonly data = inject<{
    games: Array<Game>;
    selectedGame?: BoardGame;
  }>(MAT_DIALOG_DATA);

  protected readonly gameForm = this.initForm(this.data.selectedGame);
  protected readonly loading = signal(false);

  private readonly formValue = toSignal(this.gameForm.valueChanges.pipe(startWith(this.gameForm.value)));
  private readonly formStatus = toSignal(this.gameForm.statusChanges.pipe(startWith(this.gameForm.status)));

  protected readonly formInvalid = computed(() => this.formStatus() === 'INVALID');
  protected readonly magicDisabled = computed(() => !this.formValue()?.id || !this.formValue()?.name);

  private initForm(game?: BoardGame): FormGroup {
    const uniqueRef: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const exist = this.data.games.some(existingGame => existingGame.ref === control.value);
      const edit = this.data.selectedGame?.ref === control.value;
      return (exist && !edit) ? {exist: true} : null;
    };

    return this.formBuilder.group({
      ...game,
      ref: this.formBuilder.control(game?.ref, [Validators.required, uniqueRef]),
      name: this.formBuilder.control(game?.name, Validators.required),
      description: this.formBuilder.control(game?.description),
      isNew: this.formBuilder.control(game?.isNew ?? true),
      category: this.formBuilder.control(game?.category, Validators.required),
      libraryId: this.formBuilder.control<LibraryId>(game ? GamesUtils.libraryIdOfGame(game) : 'boardGames', Validators.required),
      weight: this.formBuilder.control(game?.weight),
      id: this.formBuilder.control(game?.id),
      cover: this.formBuilder.control(game?.cover),
      maxPlayers: this.formBuilder.control(game?.maxPlayers),
      minAge: this.formBuilder.control(game?.minAge),
      minPlayers: this.formBuilder.control(game?.minPlayers),
      playingTime: this.formBuilder.control(game?.playingTime),
      suggestedPlayAge: this.formBuilder.control(game?.suggestedPlayAge),
      themes: this.formBuilder.control(game?.themes),
      yearPublished: this.formBuilder.control(game?.yearPublished),
    });
  }

  protected async addGame(): Promise<void> {
    if (this.gameForm.valid) {
      const game = this.gameForm.value;
      // The cover is already updated by the upload cover service.
      delete game.cover;
      await this.repository.updateGame(game, this.gameForm.value.libraryId);
      this.cancel();
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected async makeSomeMagic(): Promise<void> {
    this.loading.set(true);
    try {
      const detailedGame = await firstValueFrom(this.bggService.gameDetails(this.gameForm.value));
      const description = await this.openAiService.genDescriptionJeu(detailedGame).catch(error => {
        console.warn(error);
      });
      if (description) {
        detailedGame.description = description;
      }
      this.gameForm.patchValue(detailedGame);
    } finally {
      this.loading.set(false);
    }
  }

  protected async deleteGame(): Promise<void> {
    await this.repository.deleteGame(this.data.selectedGame);
    this.cancel();
  }
}
