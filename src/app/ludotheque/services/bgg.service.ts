import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as convert from 'xml-js';
import {BoardGame, Thing} from '../../models/boardGame.model';
import {GamesUtils} from '../../models/gamesUtils';

@Injectable({
  providedIn: 'root'
})
export class BGGService {
  private http = inject(HttpClient);

  private bggUrl = 'https://www.boardgamegeek.com/xmlapi2';

  send(url: string): Observable<Array<Thing>> {
    return this.http.get(url, {responseType: 'text'}).pipe(
      map(response => {
        return convert.xml2json(response, {compact: false, spaces: 4});
      }),
      map(jsonrep => {
        const json = JSON.parse(jsonrep);
        return json['elements'][0]['elements'];
      })
    );
  }

  searchGame(search: string): Observable<Array<Thing>> {
    const url = `${this.bggUrl}/search?query=${search}&type=boardgame`;
    return this.send(url);
  }

  gameDetails(ludoGame: BoardGame): Observable<BoardGame> {
    if (typeof +ludoGame.id === 'number') {
      const url = `${this.bggUrl}/thing?id=${ludoGame.id}`;
      return this.send(url).pipe(map(rep => {
        const detailsFromApi: Thing | null = rep ? rep[0] : null;
        return GamesUtils.convertGameDetailsThingToBoardGame(ludoGame, detailsFromApi);
      }));
    } else {
      return of(ludoGame);
    }
  }
}
