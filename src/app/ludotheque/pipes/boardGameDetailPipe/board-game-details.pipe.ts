import {Pipe, PipeTransform} from '@angular/core';
import {BGGService} from '../../services/bgg.service';
import {Observable} from 'rxjs';
import {BoardGame, LudoGame} from '../../../models/boardGame.model';

@Pipe({
  name: 'boardGameDetails'
})
export class BoardGameDetailsPipe implements PipeTransform {

  constructor(private bggServ: BGGService) {
  }

  transform(value: LudoGame): Observable<BoardGame> {
    return this.bggServ.gameDetails(value);
  }

}
