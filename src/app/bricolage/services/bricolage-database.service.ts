import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {map, Observable, take} from 'rxjs';
import {Library} from '../../models/author.model';
import {BddTools, Tool} from '../models/bricolage.model';
import {BricoUtils} from '../models/brico-utils';

@Injectable({
  providedIn: 'root'
})
export class BricolageDatabaseService {

  bricolageLibrary$: Observable<Library>;

  constructor(private db: AngularFireDatabase) {
    this.bricolageLibrary$ = this.db.object<Library>('bricolage/library')
      .valueChanges().pipe(take(1));
  }

  getBricoCategory(categoryId: string): Observable<Tool[]> {
    return this.db.object<BddTools>(`bricolage/tools/${categoryId}`).valueChanges().pipe(
      take(1),
      map((bddTools) => BricoUtils.bddToolToTool(bddTools) as Array<Tool>)
    );
  }
}
