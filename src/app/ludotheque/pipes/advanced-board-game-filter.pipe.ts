import { Pipe, PipeTransform, inject } from '@angular/core';
import {map, Observable} from 'rxjs';
import {FilterBoardGamesService} from '../services/filter-board-games.service';
import {AdvancedBoardGameFilter, BoardGame} from '../../models/boardGame.model';

@Pipe({ name: 'advancedBoardGameFilter' })
export class AdvancedBoardGameFilterPipe implements PipeTransform {
  private filterBoardGamesService = inject(FilterBoardGamesService);


  transform(boardGames: BoardGame[]): Observable<BoardGame[]> {
    return this.filterBoardGamesService.filter$.pipe(map(filter => {
      return boardGames.filter(boardGame => {
        let {ageOk, durationOk, nbPlayersOk} = this.filterBoardGame(filter, boardGame);
        return ageOk && durationOk && nbPlayersOk;
      })
    }));
  }

  private filterBoardGame(filter: AdvancedBoardGameFilter, boardGame: BoardGame) {
    let ageOk = true;
    let durationOk = true;
    let nbPlayersOk = true;
    if (filter.age) {
      if (boardGame.suggestedPlayAge) {
        ageOk = boardGame.suggestedPlayAge <= +filter.age;
      } else {
        ageOk = boardGame.minAge <= +filter.age;
      }
    }
    if (filter.duration && boardGame.playingTime) {
      if (filter.duration === '<15') {
        durationOk = boardGame.playingTime <= 15;
      }
      if (filter.duration === '15>30') {
        durationOk = (boardGame.playingTime >= 15) && (boardGame.playingTime <= 30);
      }
      if (filter.duration === '30>60') {
        durationOk = (boardGame.playingTime >= 30) && (boardGame.playingTime <= 60);
      }
      if (filter.duration === '>60') {
        durationOk = boardGame.playingTime >= 60;
      }
    }
    if (filter.nbPlayers && boardGame.maxPlayers && boardGame.minPlayers) {
      if (filter.nbPlayers === '8+') {
        nbPlayersOk = boardGame.maxPlayers >= 8;
      } else {
        nbPlayersOk = (boardGame.minPlayers <= +filter.nbPlayers) && (boardGame.maxPlayers >= +filter.nbPlayers);
      }
    }
    return {ageOk, durationOk, nbPlayersOk};
  }
}
