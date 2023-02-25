import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BoardGame, BoardGameCategory} from '../../../models/boardGame.model';
import {Consoles, VideoGame} from '../../../models/videoGames.model';
import {LudoStatus} from '../../../models/common.model';
import {OutsideGame} from '../../../models/outsideGames.model';

@Component({
  selector: 'app-admin-games',
  templateUrl: './admin-games.component.html',
  styleUrls: ['./admin-games.component.scss']
})
export class AdminGamesComponent {
  columnsBoardGames = ['status', 'category', 'name', 'poids', 'ref'];
  columnsVideoGame = ['status', 'category', 'name', 'ref'];
  columnsOutsideGame = ['status', 'category', 'name', 'ref'];
  search: string = '';
  boardGamePanelOpen: boolean = false;
  videoGamePanelOpen: boolean = false;
  outsideGamePanelOpen: boolean = false;
  gameForm: FormGroup;
  categoryOptions: Array<{ id: string; name: string }> = [];


  constructor(public firebaseDatabaseService: FirebaseDatabaseService, private fb: FormBuilder) {
    this.gameForm = this.fb.group({
      ref: this.fb.control('', Validators.required),
      name: this.fb.control('', Validators.required),
      categoryId: this.fb.control('', Validators.required),
      libraryId: this.fb.control('boardGames', Validators.required),
      weight: this.fb.control(null),
      id: this.fb.control(null)
    });
    this.setCategoryOptions('boardGames');
  }

  public setCategoryOptions(category: 'boardGames' | 'videoGames' | 'outsideGames') {
    console.log(category);
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
}
