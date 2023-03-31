import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AdvancedBoardGameFilter} from '../../models/boardGame.model';

@Injectable({
  providedIn: 'root'
})
export class FilterBoardGamesService {
  filter$: BehaviorSubject<AdvancedBoardGameFilter> = new BehaviorSubject<AdvancedBoardGameFilter>({
    age: null,
    duration: null,
    nbPlayers: null
  });

  constructor() {
  }
}
