import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardGame} from '../../../../models/boardGame.model';
import {VideoGame} from '../../../../models/videoGames.model';
import {Game, LudoStatus} from '../../../../models/common.model';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {map, Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {GamesUtils} from '../../../../models/gamesUtils';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit, OnChanges {
  @Input() boardGames: Array<Game> | null;
  @Input() videoGames: Array<Game> | null;
  @Input() outsideGames: Array<Game> | null;
  gameForm: FormGroup;
  modifyGameForm: FormGroup;
  allGames: Game[];
  filteredOptions$: Observable<Array<Game>>;
  searchText: FormControl<string>;
  selectedGame: any;
  fileToUpload: string | ArrayBuffer;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private firebaseDatabaseService: FirebaseDatabaseService) {
    this.gameForm = this.initForm();
    this.modifyGameForm = this.initForm();
    this.searchText = new FormControl('');
    this.allGames = [];
  }

  // todo fix type
  private initForm(game?: BoardGame): FormGroup {
    return this.fb.group({
      ref: this.fb.control(game?.ref, Validators.required),
      name: this.fb.control(game?.name, Validators.required),
      description: this.fb.control(game?.description),
      isNew: this.fb.control(game?.isNew),
      category: this.fb.control(game?.category, Validators.required),
      libraryId: this.fb.control(game ? GamesUtils.libraryIdOfGame(game) : 'boardGames', Validators.required),
      weight: this.fb.control(game?.weight),
      id: this.fb.control(game?.id)
    });
  }

  ngOnInit() {
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map((value) => this._filter(value || '', this.allGames)),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.boardGames && this.videoGames && this.outsideGames) {
      this.allGames = [...this.boardGames, ...this.videoGames, ...this.outsideGames];
    }
  }

  async addGame() {
    if (this.gameForm.valid) {
      const {id, ref, name, categoryId, libraryId, weight} = this.gameForm.value;
      const game: BoardGame | VideoGame | Game =
        {ref, name, category: categoryId, weight: weight, id, status: LudoStatus.AVAILABLE};
      try {
        await this.firebaseDatabaseService.addGame(game, libraryId);
      } catch (e) {
        console.error(e);
      }
    }
  }

  private _filter(value: string | Game, userList: Array<Game>): Array<Game> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return userList.filter((item) => item.name.toLowerCase().includes(filterValue));
  }

  displayGame(option: Game) {
    return option.name;
  }

  selectGameToModify($event: MatAutocompleteSelectedEvent) {
    this.selectedGame = $event.option.value;
    this.modifyGameForm = this.initForm($event.option.value);
  }

  updateGame() {
    const gameToUpdate = this.modifyGameForm.value;
    delete gameToUpdate.libraryId;
    this.firebaseDatabaseService.updateGame(gameToUpdate, GamesUtils.libraryIdOfGame(gameToUpdate)).then(
      () =>
        this.snackBar.open(`${gameToUpdate.name} bien mis à jour`, 'Ok')
    );
  }
}
