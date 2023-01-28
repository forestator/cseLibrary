import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-board-game-category-details',
  templateUrl: './board-game-category-details.component.html',
  styleUrls: ['./board-game-category-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardGameCategoryDetailsComponent implements OnInit {

  @Input() boardGames: Array<{id: string; name: string; category: string;}> | null = [];
  constructor() { }

  ngOnInit(): void {
  }

  trackBoardGame(index: number, item: {id: string; name: string; category: string;}){
    return item.id + item.name;
  }
}
