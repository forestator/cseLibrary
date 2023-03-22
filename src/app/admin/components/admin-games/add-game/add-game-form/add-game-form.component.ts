import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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

  constructor(private cdr: ChangeDetectorRef) {
    this.setCategoryOptions('boardGames');
    setInterval(() => {
      this.cdr.detectChanges();
    }, 1000);
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

  search() {
    const name = this.gameForm.get('name').value;
    window.open(`https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${name}`,
      '_blank');
  }
}
