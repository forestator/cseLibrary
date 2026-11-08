import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {BoardGameCategory, Thing} from '../../../../../models/boardGame.model';
import {Consoles, VideoGameType} from '../../../../../models/videoGames.model';
import {FormControl, FormGroup} from '@angular/forms';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {BggGameSearchModalComponent} from '../bgg-game-search-modal/bgg-game-search-modal.component';

@Component({
    selector: 'app-add-game-form',
    templateUrl: './add-game-form.component.html',
    styleUrls: ['./add-game-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddGameFormComponent implements OnChanges {

  @Input() gameForm: FormGroup;
  @Output() gameSelected: EventEmitter<void> = new EventEmitter<void>();
  categoryOptions: Array<{ id: string; name: string }> = [];

  constructor(private bggService: BGGService,
              private dialog: MatDialog,) {
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
        this.gameForm.addControl('type', new FormControl(VideoGameType.GAME));
        break;
      case 'outsideGames':
        this.categoryOptions = [{id: category, name: 'Jeu plein air'}];
        break;
    }
  }

  search() {
    const name = this.gameForm.get('name').value;
    if (name) {
      this.bggService.searchGame(name).pipe(take(1)).subscribe(rep => {
        const ref = this.dialog.open(BggGameSearchModalComponent, {
          data: {games: rep}
        });
        ref.afterClosed().pipe(take(1)).subscribe((thing?: Thing) => {
          if (thing) {
            this.gameForm.get('id').setValue(thing.attributes?.id);
            this.gameSelected.next();
          }
        });
      })
    }
  }
}
