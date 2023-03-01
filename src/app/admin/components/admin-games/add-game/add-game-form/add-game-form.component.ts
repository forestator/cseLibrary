import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BoardGameCategory} from '../../../../../models/boardGame.model';
import {Consoles} from '../../../../../models/videoGames.model';
import {FormGroup} from '@angular/forms';
import {GamesUtils} from '../../../../../models/gamesUtils';

@Component({
  selector: 'app-add-game-form',
  templateUrl: './add-game-form.component.html',
  styleUrls: ['./add-game-form.component.scss']
})
export class AddGameFormComponent implements OnChanges {

  @Input() gameForm: FormGroup;
  categoryOptions: Array<{ id: string; name: string }> = [];

  constructor() {
    this.setCategoryOptions('boardGames');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCategoryOptions(GamesUtils.libraryIdOfGame(this.gameForm.value));
  }

  public setCategoryOptions(category: string) {
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
}
