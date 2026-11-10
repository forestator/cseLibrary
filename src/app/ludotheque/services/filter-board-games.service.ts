import {Injectable, computed, signal} from '@angular/core';
import {AdvancedBoardGameFilter, BoardGame} from '../../models/boardGame.model';

@Injectable({
  providedIn: 'root'
})
export class FilterBoardGamesService {
  readonly filter = signal<AdvancedBoardGameFilter>({age: null, duration: null, nbPlayers: null});

  readonly activeCount = computed(() => Object.values(this.filter()).filter(value => !!value).length);

  matches(boardGame: BoardGame, filter: AdvancedBoardGameFilter = this.filter()): boolean {
    return this.isAgeOk(boardGame, filter.age)
      && this.isDurationOk(boardGame, filter.duration)
      && this.isNbPlayersOk(boardGame, filter.nbPlayers);
  }

  private isAgeOk(boardGame: BoardGame, age?: string): boolean {
    if (!age) {
      return true;
    }
    return (boardGame.suggestedPlayAge || boardGame.minAge) <= +age;
  }

  private isDurationOk(boardGame: BoardGame, duration?: string): boolean {
    const playingTime = boardGame.playingTime;
    if (!duration || !playingTime) {
      return true;
    }
    switch (duration) {
      case '<15':
        return playingTime <= 15;
      case '15>30':
        return playingTime >= 15 && playingTime <= 30;
      case '30>60':
        return playingTime >= 30 && playingTime <= 60;
      case '>60':
        return playingTime >= 60;
      default:
        return true;
    }
  }

  private isNbPlayersOk(boardGame: BoardGame, nbPlayers?: string): boolean {
    const {minPlayers, maxPlayers} = boardGame;
    if (!nbPlayers || !maxPlayers || !minPlayers) {
      return true;
    }
    if (nbPlayers === '8+') {
      return maxPlayers >= 8;
    }
    return minPlayers <= +nbPlayers && maxPlayers >= +nbPlayers;
  }
}
