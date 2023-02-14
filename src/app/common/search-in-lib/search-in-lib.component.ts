import {Component, Input, OnInit} from '@angular/core';
import {BoardGame} from '../../models/boardGame.model';
import {map, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-in-lib',
  templateUrl: './search-in-lib.component.html',
  styleUrls: ['./search-in-lib.component.scss']
})
export class SearchInLibComponent implements OnInit {

  @Input() boardGames!: Array<BoardGame>;
  searchText: FormControl = new FormControl('');
  filteredOptions?: Observable<any>;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.boardGames.filter((boardGame) =>
      boardGame.name.toLowerCase().includes(filterValue)
    ).map((bg) => bg.name);
  }

  goToSelectedItem(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
    const boardGame: BoardGame = this.boardGames.find(bg => bg.name === matAutocompleteSelectedEvent.option.value)!;
    this.router.navigateByUrl(`/ludotheque/j2s/${boardGame.category}/${boardGame.id}`);
  }
}
