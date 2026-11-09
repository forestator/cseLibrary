import { Pipe, PipeTransform, inject } from '@angular/core';
import {BGGService} from '../../services/bgg.service';
import {Observable} from 'rxjs';
import {BoardGame} from '../../../models/boardGame.model';

@Pipe({ name: 'boardGameDetails' })
export class BoardGameDetailsPipe implements PipeTransform {
  private bggServ = inject(BGGService);


  transform(value: BoardGame): Observable<BoardGame> {
    return this.bggServ.gameDetails(value);
  }

}
