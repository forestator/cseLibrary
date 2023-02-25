import {Component} from '@angular/core';
import {FirebaseDatabaseService} from '../../../services/firebase/firebase-database.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
      weight: this.fb.control(null)
    });
    this.setCategoryOptions('boardGames');
  }

  private setCategoryOptions(boardGames: string) {
    
  }
}
