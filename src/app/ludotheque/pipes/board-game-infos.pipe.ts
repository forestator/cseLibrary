import {Pipe, PipeTransform} from '@angular/core';
import {BoardGame} from '../../models/boardGame.model';

@Pipe({name: 'boardGameInfos'})
export class BoardGameInfosPipe implements PipeTransform {
  transform(boardGame: BoardGame): Array<string> {
    const infos: Array<string> = [];
    if (boardGame.weight) {
      infos.push(`Poids: ${boardGame.weight}g`);
    }
    if (boardGame.playingTime) {
      infos.push(`Temps de jeu: ${boardGame.playingTime} minutes`);
    }
    if (boardGame.minPlayers) {
      infos.push(`Min joueurs: ${boardGame.minPlayers}`);
    }
    if (boardGame.maxPlayers) {
      infos.push(`Max joueurs: ${boardGame.maxPlayers}`);
    }
    if (boardGame.minAge) {
      infos.push(`Age mini: ${boardGame.minAge}`);
    }
    if (boardGame.suggestedPlayAge) {
      infos.push(`Age suggéré: ${boardGame.suggestedPlayAge}`);
    }
    if (boardGame.yearPublished) {
      infos.push(`Année de publication: ${boardGame.yearPublished}`);
    }
    if (boardGame.themes?.length) {
      infos.push(`Themes : ${boardGame.themes.join(' ')}`);
    }
    return infos;
  }
}
