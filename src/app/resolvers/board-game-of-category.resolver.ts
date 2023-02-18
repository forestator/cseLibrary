import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../services/firebase-database.service';
import {BoardGame} from '../models/boardGame.model';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardGameOfCategoryResolver implements Resolve<Observable<BoardGame[]>> {

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BoardGame[]> {
    const categoryId = <string>route.paramMap.get('categoryId');
    return this.firebaseDatabaseService.boardGames$.pipe(
      map(boardGames => boardGames.filter(bg => bg.category === categoryId)),
      catchError(() => EMPTY)
    );
  }
}
