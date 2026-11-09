import { Injectable, inject } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {Observable, take} from 'rxjs';
import {Biblio} from '../../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {
  private db = inject(AngularFireDatabase);

  public bibliothequeOneShot$: Observable<Array<Biblio> | null>;
  public bibliothequeStream$: Observable<Array<Biblio>>;

  constructor() {
    this.bibliothequeOneShot$ = this.db.object<Array<Biblio>>('bibliotheque').valueChanges()
      .pipe(take(1));
    this.bibliothequeStream$ = this.db.object<Array<Biblio>>('bibliotheque').valueChanges();
  }
}
