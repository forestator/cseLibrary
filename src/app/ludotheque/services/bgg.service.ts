import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as convert from 'xml-js';
import {BoardGame, Thing} from '../../models/boardGame.model';
import {GamesUtils} from '../../models/gamesUtils';

@Injectable({
  providedIn: 'root'
})
export class BGGService {
  private bggUrl = 'https://www.boardgamegeek.com/xmlapi2';

  private cache: Array<{ bgId: number; bg: BoardGame }> = [];

  constructor(private http: HttpClient) {
  }

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
    const gameInCache = this.cache.find(game => game.bgId === +ludoGame.id);
    if (gameInCache) {
      gameInCache.bg.status = ludoGame.status;
      return of(gameInCache.bg);
    } else if (typeof +ludoGame.id === 'number') {
      const url = `${this.bggUrl}/thing?id=${ludoGame.id}`;
      return this.send(url).pipe(map(rep => {
        const detailsFromApi: Thing | null = rep ? rep[0] : null;
        const convertedGame = GamesUtils.convertGameDetailsThingToBoardGame(ludoGame, detailsFromApi);
        this.cache.push({bgId: +ludoGame.id, bg: convertedGame});
        return convertedGame;
      }));
    } else {
      return of(GamesUtils.convertGameDetailsThingToBoardGame(ludoGame, null));
    }
  }
}
