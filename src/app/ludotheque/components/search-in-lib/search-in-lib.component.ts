import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {map, Observable} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {VideoGame} from '../../../models/videoGames.model';
import {DataService} from '../../../services/biblio/data.service';
import {Game} from '../../../models/common.model';

export interface SearchOption {
  category: string;
  name: string;
  id: string
}

@Component({
  selector: 'app-search-in-lib',
  templateUrl: './search-in-lib.component.html',
  styleUrls: ['./search-in-lib.component.scss']
})
export class SearchInLibComponent implements OnInit, OnChanges {

  @Input() boardGames!: Array<BoardGame> | null;
  @Input() videoGames!: Array<VideoGame> | null;
  @Input() outsideGames!: Array<Game> | null;
  searchText: UntypedFormControl = new UntypedFormControl('');
  filteredOptions$?: Observable<Array<SearchOption>>;

  datas: Array<{ category: string; name: string; id: string }> = [];
  private currentUrl?: string;

  constructor(private dataService: DataService,
              private router: Router,
              private navigateService: NavigationService) {
  }

  ngOnInit() {
    this.filteredOptions$ = this.searchText.valueChanges.pipe(
      map(value => this._filter(value || '')),
    );
    this.navigateService.url$.subscribe(url => this.datas = this.setDatasToSeachIn(url));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentUrl) {
      this.datas = this.setDatasToSeachIn(this.currentUrl);
    }
  }

  private _filter(value: string | Game): { category: string; name: string; id: string }[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.datas.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    this.navigateService.goToGame(matAutocompleteSelectedEvent.option.value);
  }

  private setDatasToSeachIn(url: string): Array<SearchOption> {
    this.currentUrl = url;
    if (this.boardGames && url.includes('boardGames')) {
      return this.boardGames;
    } else if (this.videoGames && url.includes('videoGames')) {
      return this.videoGames.map((vg) => {
        return {id: vg.ref, category: vg.category, name: vg.name};
      });
    } else if (this.outsideGames && url.includes('outsideGames')) {
      return this.outsideGames.map((game) => {
        return {id: game.ref, category: game.category, name: game.name};
      });
    } else {
      const defaultSearch: Array<SearchOption> = [];
      if (this.boardGames) {
        defaultSearch.push(...this.boardGames);
      }
      if (this.videoGames) {
        this.videoGames.forEach((vg) => {
          defaultSearch.push({id: vg.ref, category: vg.category, name: vg.name});
        });
      }
      if (this.outsideGames) {
        this.outsideGames.forEach((outsideG) => {
          defaultSearch.push({id: outsideG.ref, category: outsideG.category, name: outsideG.name});
        });
      }
      return defaultSearch;
    }
  }

  displayGame(game?: Game): string {
    return game ? `${game.name}` : '';
  }
}
