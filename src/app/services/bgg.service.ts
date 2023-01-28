import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as convert from 'xml-js';
import {BoardGame, Thing} from '../models/boardGame.model';
import {ThingToBoardgame} from '../models/thingToBoardgame';

@Injectable({
  providedIn: 'root'
})
export class BGGService {
  private bggUrl = 'https://www.boardgamegeek.com/xmlapi2';

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

  gameDetails(gameId: string): Observable<BoardGame> {
    const url = `${this.bggUrl}/thing?id=${gameId}`;
    return this.send(url).pipe(map(rep => {
      return ThingToBoardgame.convertGameDetailsThingToBoardGame(rep[0]);
    }));
  }
}
