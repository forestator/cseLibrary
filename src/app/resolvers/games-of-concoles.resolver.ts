import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, map, Observable} from 'rxjs';
import {FirebaseDatabaseService} from '../services/firebase-database.service';
import {catchError} from 'rxjs/operators';
import {VideoGame} from '../models/videoGames.model';

@Injectable({
  providedIn: 'root'
})
export class GamesOfConcolesResolver implements Resolve<Observable<{ videoGames: VideoGame[], selectedId: string | null }>> {

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ videoGames: VideoGame[], selectedId: string | null }> {
    const categoryId = <string>route.paramMap.get('categoryId');
    return this.firebaseDatabaseService.videoGamesOneShot$.pipe(
      map(videoGames => videoGames.filter(bg => bg.category === categoryId)),
      map(videoGames => {
        return {videoGames: videoGames, selectedId: route.paramMap.get('id'), categoryId: categoryId};
      }),
      catchError(() => EMPTY)
    );
  }
}
