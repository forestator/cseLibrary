import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardGame} from '../../../../models/boardGame.model';
import {VideoGame} from '../../../../models/videoGames.model';
import {Game, LudoStatus} from '../../../../models/common.model';
import {FirebaseDatabaseService} from '../../../../services/firebase/firebase-database.service';
import {map, Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {GamesUtils} from '../../../../models/gamesUtils';

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

  constructor(private fb: FormBuilder, private firebaseDatabaseService: FirebaseDatabaseService) {
    this.gameForm = this.initForm();
    this.modifyGameForm = this.initForm();
    this.searchText = new FormControl('');
    this.allGames = [];
  }

  private initForm() {
    return this.fb.group({
      ref: this.fb.control('', Validators.required),
      name: this.fb.control('', Validators.required),
      description: this.fb.control(null),
      categoryId: this.fb.control('', Validators.required),
      libraryId: this.fb.control('boardGames', Validators.required),
      weight: this.fb.control(null),
      id: this.fb.control(null)
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
        {ref, name, category: categoryId, poids: weight, id, status: LudoStatus.AVAILABLE};
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
    this.modifyGameForm = this.fb.group({
        ref: $event.option.value.ref,
        name: $event.option.value.name,
        description: $event.option.value.description,
        categoryId: $event.option.value.category,
        libraryId: GamesUtils.libraryIdOfGame($event.option.value),
        weight: $event.option.value?.poids ?? 0,
        id: $event.option.value?.id ?? ''
    });
  }

  updateGame() {
    console.log(this.modifyGameForm.value);
    console.log(this.fileToUpload);
  }
}
