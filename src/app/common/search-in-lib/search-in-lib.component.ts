import {Component, Input, OnInit} from '@angular/core';
import {BoardGame} from '../../models/boardGame.model';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {NavigationService} from '../../services/navigation.service';
import {VideoGame, VideoGamesLibs} from '../../models/videoGames.model';

@Component({
  selector: 'app-search-in-lib',
  templateUrl: './search-in-lib.component.html',
  styleUrls: ['./search-in-lib.component.scss']
})
export class SearchInLibComponent implements OnInit {

  @Input() boardGames!: Array<BoardGame>;
  @Input() videoGames!: VideoGamesLibs;
  searchText: FormControl = new FormControl('');
  filteredOptions?: Observable<any>;

  datas: Array<BoardGame | VideoGame> = [];

  constructor(private router: Router, private navigateService: NavigationService) {
  }

  ngOnInit() {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      map(value => this._filter(value || '')),
    );
    this.navigateService.url$.subscribe(url => this.datas = this.setDatasToSeachIn(url));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.datas.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    ).map((val) => val.name);
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    const optValue = matAutocompleteSelectedEvent.option.value;
    const boardGame: BoardGame | undefined = this.boardGames.find(bg => bg.name === optValue);
    if (boardGame) {
      this.navigateService.goToBoardGame(boardGame);
    }

    const videoGame: VideoGame | undefined = this.datas.find(vg => vg.name === optValue);
    if (videoGame && this.videoGames.switch.some(vg => vg.ref === videoGame.ref)) {
      this.navigateService.goToVideoGame(videoGame, 'switch');
    }
  }

  private setDatasToSeachIn(url: string): Array<BoardGame | VideoGame> {
    if (url.includes('j2s')) {
      return this.boardGames;
    } else {
      const switchGames = this.videoGames.switch;
      const ps4Games = this.videoGames.ps4;
      const ps5Games = this.videoGames.ps5;
      return [...switchGames, ...ps4Games, ...ps5Games];
    }
  }
}
