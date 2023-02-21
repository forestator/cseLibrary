import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../services/firebase-database.service';
import {BoardGame} from '../models/boardGame.model';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardGameOfCategoryResolver implements Resolve<Observable<{ boardGames: BoardGame[], selectedId: string | null }>> {

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ boardGames: BoardGame[], selectedId: string | null }> {
    const categoryId = <string>route.paramMap.get('categoryId');
    return this.firebaseDatabaseService.boardGamesSnapshot$.pipe(
      map(boardGames => boardGames.filter(bg => bg.category === categoryId)),
      map(boardGames => {
        return {boardGames: boardGames, selectedId: route.paramMap.get('id'), categoryId: categoryId};
      }),
      catchError(() => EMPTY)
    );
  }
}
