import { Injectable, inject } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {BehaviorSubject, filter, map, Observable} from 'rxjs';
import {BoardGame} from '../models/boardGame.model';
import {GamesUtils} from '../models/gamesUtils';
import {Comissions} from "../models/common.model";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  public url$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.url)
    ).subscribe(url => this.url$.next(url));
  }

  getRouteParams(): Observable<Params> {
    return this.route.firstChild!.params;
  }

  goToComission(comissionName: Comissions): void {
    this.router.navigateByUrl(`/${comissionName}`);
  }

  goToGame(game: BoardGame): void {
    const gameCat = GamesUtils.libraryIdOfGame(game);
    if (gameCat === 'outsideGames') {
      this.router.navigateByUrl(`/ludotheque/${gameCat}/${game.id ?? game.ref}`);
    } else {
      this.router.navigateByUrl(`/ludotheque/${gameCat}/${game.category}/${game.id ?? game.ref}`);
    }
  }

  goToCatalogueItem(commission: Comissions, item: {categoryId?: string; id: string}) {
    this.router.navigateByUrl(`/${commission}/${item.categoryId}/${item.id}`);
  }
}
