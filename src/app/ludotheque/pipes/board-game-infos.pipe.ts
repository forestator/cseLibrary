import {Pipe, PipeTransform} from '@angular/core';
import {BoardGame} from '../../models/boardGame.model';
import {GameFact, GameInfos} from '../models';

@Pipe({name: 'boardGameInfos'})
export class BoardGameInfosPipe implements PipeTransform {
  transform(boardGame: BoardGame): GameInfos {
    return {facts: this.facts(boardGame), details: this.details(boardGame)};
  }

  private facts(boardGame: BoardGame): Array<GameFact> {
    const facts: Array<GameFact> = [];
    const players = this.players(boardGame);
    if (players) {
      facts.push({icon: 'group', label: players});
    }
    if (boardGame.playingTime) {
      facts.push({icon: 'timer', label: `${boardGame.playingTime} min`});
    }
    if (boardGame.minAge) {
      facts.push({icon: 'family_restroom', label: `${boardGame.minAge} ans et +`});
    }
    return facts;
  }

  private players({minPlayers, maxPlayers}: BoardGame): string | undefined {
    if (minPlayers && maxPlayers) {
      return minPlayers === maxPlayers ? `${minPlayers} joueurs` : `${minPlayers} à ${maxPlayers} joueurs`;
    }
    const known = minPlayers ?? maxPlayers;
    if (!known) {
      return undefined;
    }
    return minPlayers ? `${known} joueurs min.` : `${known} joueurs max.`;
  }

  private details(boardGame: BoardGame): Array<string> {
    const details: Array<string> = [];
    if (boardGame.weight) {
      details.push(`Poids : ${boardGame.weight} g`);
    }
    if (boardGame.suggestedPlayAge) {
      details.push(`Âge suggéré : ${boardGame.suggestedPlayAge} ans`);
    }
    if (boardGame.yearPublished) {
      details.push(`Année de publication : ${boardGame.yearPublished}`);
    }
    if (boardGame.themes?.length) {
      details.push(`Thèmes : ${boardGame.themes.join(', ')}`);
    }
    return details;
  }
}
