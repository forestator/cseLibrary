import { Component, EventEmitter, OnChanges, Output, SimpleChanges, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {BoardGameCategory, Thing} from '../../../../../models/boardGame.model';
import {Consoles, VideoGameType} from '../../../../../models/videoGames.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {GamesUtils} from '../../../../../models/gamesUtils';
import {BGGService} from '../../../../../ludotheque/services/bgg.service';
import {take} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {BggGameSearchModalComponent} from '../bgg-game-search-modal/bgg-game-search-modal.component';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { BadgeComponent } from '../../../../../common/components/book-badge/badge.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { UploadGameComponent } from '../upload-game/upload-game.component';

@Component({
    selector: 'app-add-game-form',
    templateUrl: './add-game-form.component.html',
    styleUrls: ['./add-game-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, MatButtonToggleGroup, MatButtonToggle, MatFormField, MatLabel, MatInput, MatIcon, MatSelect, MatOption, BadgeComponent, MatCheckbox, MatDivider, UploadGameComponent]
})
export class AddGameFormComponent implements OnChanges {
  private bggService = inject(BGGService);
  private dialog = inject(MatDialog);


  readonly gameForm = input<FormGroup>(undefined);
  @Output() gameSelected: EventEmitter<void> = new EventEmitter<void>();
  categoryOptions: Array<{ id: string; name: string }> = [];

  constructor() {
    this.setCategoryOptions('boardGames');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCategoryOptions(GamesUtils.libraryIdOfGame(this.gameForm().value));
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
        this.gameForm().addControl('type', new FormControl(VideoGameType.GAME));
        break;
      case 'outsideGames':
        this.categoryOptions = [{id: category, name: 'Jeu plein air'}];
        break;
    }
  }

  search() {
    const name = this.gameForm().get('name').value;
    if (name) {
      this.bggService.searchGame(name).pipe(take(1)).subscribe(rep => {
        const ref = this.dialog.open(BggGameSearchModalComponent, {
          data: {games: rep}
        });
        ref.afterClosed().pipe(take(1)).subscribe((thing?: Thing) => {
          if (thing) {
            this.gameForm().get('id').setValue(thing.attributes?.id);
            this.gameSelected.next();
          }
        });
      })
    }
  }
}
