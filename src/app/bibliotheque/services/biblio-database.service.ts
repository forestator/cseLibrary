import {Injectable} from '@angular/core';
import {Biblio} from '../../models/author.model';
import {FirebaseDatabaseService} from '../../services/firebase/firebase-database.service';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiblioDatabaseService {
  public imaginaireBiblio$: Observable<Biblio>;
  public inclassaveBiblio$: Observable<Biblio>;
  public jeunesseBiblio$: Observable<Biblio>;
  public adulteBiblio$: Observable<Biblio>;

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {
    // only works with oneshot atm and not with updated stream
    this.imaginaireBiblio$ = this.firebaseDatabaseService.bibliothequeOneShot$.pipe(map(allBiblio => allBiblio[0]));
    this.inclassaveBiblio$ = this.firebaseDatabaseService.bibliothequeOneShot$.pipe(map(allBiblio => allBiblio[1]));
    this.jeunesseBiblio$ = this.firebaseDatabaseService.bibliothequeOneShot$.pipe(map(allBiblio => allBiblio[2]));
    this.adulteBiblio$ = this.firebaseDatabaseService.bibliothequeOneShot$.pipe(map(allBiblio => allBiblio[3]));
  }

  addAuthor(library: Biblio, result: any) {
    // todo
  }

  addPublisher(library: Biblio, result: any) {
    // todo
  }

  addCategory(biblio: Biblio, result: any) {

  }

  getBiblio(libraryId: string): Observable<Biblio> {
    let lib: Observable<Biblio>;
    switch (libraryId) {
      case 'litterature-imaginaire':
        lib = this.imaginaireBiblio$;
        break;
      case 'inclassable':
        lib = this.inclassaveBiblio$;
        break;
      case 'litterature-jeunesse':
        lib = this.jeunesseBiblio$;
        break;
      case 'litterature-adulte':
        lib = this.adulteBiblio$;
        break;
      default:
        lib = this.imaginaireBiblio$;
    }
    return lib;
  }
}
