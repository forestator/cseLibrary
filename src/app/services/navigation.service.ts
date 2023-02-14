import {Injectable} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {BoardGame} from '../models/boardGame.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  getRouteParams(): Observable<Params> {
    return this.route.firstChild!.params;
  }

  goToComission(comissionName: 'bibliotheque' | 'ludotheque'): void {
    this.router.navigateByUrl(`/${comissionName}`);
  }

  goToBoardGame(boardGame: BoardGame): void {
    this.router.navigateByUrl(`/ludotheque/j2s/${boardGame.category}/${boardGame.id}`);
  }
}
