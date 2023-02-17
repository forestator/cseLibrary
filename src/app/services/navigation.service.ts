import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {BehaviorSubject, filter, map, Observable} from 'rxjs';
import {BoardGame} from '../models/boardGame.model';
import {VideoGame} from '../models/videoGames.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public url$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.url)
    ).subscribe(url => this.url$.next(url));
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

  goToVideoGame(videoGame: VideoGame, gameCat: string): void {
    this.router.navigateByUrl(`/ludotheque/videoGames/${gameCat}/${videoGame.ref}`);
  }
}
