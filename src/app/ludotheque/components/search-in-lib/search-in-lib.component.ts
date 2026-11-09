import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy, inject, input } from '@angular/core';
import {BoardGame} from '../../../models/boardGame.model';
import {map, Observable, startWith} from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';
import {VideoGame} from '../../../models/videoGames.model';
import {Game} from '../../../models/common.model';
import { MatFormField, MatInput } from '@angular/material/input';
import { BadgeComponent } from '../../../common/components/book-badge/badge.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-search-in-lib',
    templateUrl: './search-in-lib.component.html',
    styleUrls: ['./search-in-lib.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFormField, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, BadgeComponent, AsyncPipe]
})
export class SearchInLibComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private navigateService = inject(NavigationService);


  readonly boardGames = input.required<Array<BoardGame> | null>();
  readonly videoGames = input.required<Array<VideoGame> | null>();
  readonly outsideGames = input.required<Array<Game> | null>();
  searchText: FormControl<string> = new FormControl<string>(null);
  filteredOptions$?: Observable<Array<Game | BoardGame>>;
  datas: Array<Game | BoardGame> = [];
  currentUrl?: string;

  ngOnInit() {
    this.navigateService.url$.subscribe(url => {
      this.datas = this.setDatasToSeachIn(url);
      this.filteredOptions$ = this.searchText.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentUrl) {
      this.datas = this.setDatasToSeachIn(this.currentUrl);
    }
  }

  private _filter(value: string | Game | BoardGame | VideoGame): Array<Game | BoardGame> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
    return this.datas.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    this.navigateService.goToGame(matAutocompleteSelectedEvent.option.value);
  }

  private setDatasToSeachIn(url: string): Array<Game | BoardGame> {
    this.currentUrl = url;
    const boardGames = this.boardGames();
    const videoGames = this.videoGames();
    const outsideGames = this.outsideGames();
    if (boardGames && url.includes('boardGames')) {
      return boardGames;
    } else if (videoGames && url.includes('videoGames')) {
      return videoGames;
    } else if (outsideGames && url.includes('outsideGames')) {
      return outsideGames;
    } else {
      const defaultSearch: Array<Game> = [];
      if (boardGames) {
        defaultSearch.push(...boardGames);
      }
      if (videoGames) {
        defaultSearch.push(...videoGames);
      }
      if (outsideGames) {
        defaultSearch.push(...outsideGames);
      }
      return defaultSearch;
    }
  }

  displayGame(game?: Game): string {
    return game ? `${game.name}` : '';
  }
}
