import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardGame, BoardGameCategory} from '../../../../models/boardGame.model';
import {Consoles, VideoGame} from '../../../../models/videoGames.model';
import {OutsideGame} from '../../../../models/outsideGames.model';
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
  categoryOptions: Array<{ id: string; name: string }> = [];
  allGames: Game[];
  filteredOptions$: Observable<Array<Game>>;
  searchText: FormControl<string>;
  constructor(private fb: FormBuilder, private firebaseDatabaseService: FirebaseDatabaseService) {
    this.gameForm = this.initForm();
    this.modifyGameForm = this.initForm();
    this.setCategoryOptions('boardGames');
    this.searchText = new FormControl('');
    this.allGames = [];
  }

  private initForm() {
    return this.fb.group({
      ref: this.fb.control('', Validators.required),
      name: this.fb.control('', Validators.required),
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

  public setCategoryOptions(category: 'boardGames' | 'videoGames' | 'outsideGames') {
    switch (category) {
      case 'boardGames':
        this.categoryOptions = Object.values(BoardGameCategory).map(bgCat => {
          return {id: bgCat, name: bgCat};
        });
        break;
      case 'videoGames':
        this.categoryOptions = Object.values(Consoles).map(vgCat => {
          return {id: vgCat, name: vgCat};
        });
        break;
      case 'outsideGames':
        this.categoryOptions = [{id: category, name: 'Jeu plein air'}];
        break;
    }
  }

  async addGame() {
    if (this.gameForm.valid) {
      const {id, ref, name, categoryId, libraryId, weight} = this.gameForm.value;
      const game: BoardGame | VideoGame | OutsideGame =
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
    const selectedGame = $event.option.value;
    this.modifyGameForm.setValue({
      ref: selectedGame.ref,
      name: selectedGame.name,
      categoryId: selectedGame.category,
      libraryId: GamesUtils.libraryIdOfGame(selectedGame),
      weight: selectedGame?.poids ?? 0,
      id: selectedGame?.id ?? ''
    });
  }

  updateGame() {
    console.log(this.modifyGameForm.value);
  }
}
