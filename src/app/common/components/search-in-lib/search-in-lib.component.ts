import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {VideoGame} from '../../../models/videoGames.model';
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
export class SearchInLibComponent implements OnInit, OnChanges {

  @Input() boardGames!: Array<BoardGame> | null;
  @Input() videoGames!: Array<VideoGame> | null;
  searchText: FormControl = new FormControl('');
  filteredOptions?: Observable<Array<SearchOption>>;

  datas: Array<{ category: string; name: string; id: string }> = [];
  private currentUrl?: string;

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

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentUrl) {
      this.datas = this.setDatasToSeachIn(this.currentUrl);
    }
  }

  private _filter(value: string): { category: string; name: string; id: string }[] {
    const filterValue = value.toLowerCase();
    return this.datas.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    const optValue: SearchOption = this.datas.find(data => data.name === matAutocompleteSelectedEvent.option.value)!;
    const boardGame: BoardGame | undefined = this.boardGames?.find(bg => bg.id === optValue.id);
    if (boardGame) {
      this.navigateService.goToBoardGame(boardGame);
    } else {
      this.navigateService.goToVideoGame(optValue.id, optValue.category);
    }
  }

  private setDatasToSeachIn(url: string): Array<SearchOption> {
    this.currentUrl = url;
    if (this.boardGames && url.includes('j2s')) {
      return this.boardGames;
    } else if (this.videoGames) {
      return this.videoGames.map((vg) => {
        return {id: vg.ref, category: vg.category, name: vg.name};
      });
    } else {
      return [];
    }
  }
}
