import {Component, Input, OnInit} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {Consoles, VideoGame, VideoGamesLibs} from '../../../models/videoGames.model';
import {DataService} from '../../../services/data.service';

interface SearchOption {
  category: string;
  name: string;
  id: string
}

@Component({
  selector: 'app-search-in-lib',
  templateUrl: './search-in-lib.component.html',
  styleUrls: ['./search-in-lib.component.scss']
})
export class SearchInLibComponent implements OnInit {

  @Input() boardGames!: Array<BoardGame>;
  @Input() videoGames!: VideoGamesLibs;
  searchText: FormControl = new FormControl('');
  filteredOptions?: Observable<Array<SearchOption>>;

  datas: Array<{ category: string; name: string; id: string }> = [];

  constructor(private dataService: DataService,
              private router: Router,
              private navigateService: NavigationService) {
  }

  ngOnInit() {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      map(value => this._filter(value || '')),
    );
    this.navigateService.url$.subscribe(url => this.datas = this.setDatasToSeachIn(url));
  }

  private _filter(value: string): { category: string; name: string; id: string }[] {
    const filterValue = value.toLowerCase();
    return this.datas.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    const optValue: SearchOption = this.datas.find(data => data.name === matAutocompleteSelectedEvent.option.value)!;
    const boardGame: BoardGame | undefined = this.boardGames.find(bg => bg.id === optValue.id);
    if (boardGame) {
      this.navigateService.goToBoardGame(boardGame);
    } else {
      this.navigateService.goToVideoGame(optValue.id, optValue.category);
    }
  }

  private setDatasToSeachIn(url: string): Array<SearchOption> {
    if (url.includes('j2s')) {
      return this.boardGames;
    } else {
      return [
        ...this.videoGamesToSearchOption(this.videoGames.switch, Consoles.switch),
        ...this.videoGamesToSearchOption(this.videoGames.ps4, Consoles.ps4),
        ...this.videoGamesToSearchOption(this.videoGames.ps5, Consoles.ps5),
        ...this.videoGamesToSearchOption(this.videoGames.xboxOne, Consoles.xboxOne),
      ];
    }
  }

  private videoGamesToSearchOption(videoGames: VideoGame[], console: string): Array<SearchOption> {
    return videoGames.map(videoGame => {
      return {name: videoGame.name, id: videoGame.ref, category: console};
    })
  }
}
