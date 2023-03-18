import {Injectable} from '@angular/core';
import {Biblio, Library} from '../../models/author.model';
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

  addAuthor(library: Library, result: any) {
    // todo
  }

  addPublisher(library: Library, result: any) {
    // todo
  }

  getLibrary(libraryId: string): Observable<Library> {
    let lib: Observable<Library>;
    switch (libraryId) {
      case 'litterature-imaginaire':
        lib = this.imaginaireBiblio$.pipe(map(b => b.library));
        break;
      case 'inclassable':
        lib = this.inclassaveBiblio$.pipe(map(b => b.library));
        break;
      case 'litterature-jeunesse':
        lib = this.jeunesseBiblio$.pipe(map(b => b.library));
        break;
      case 'litterature-adulte':
        lib = this.adulteBiblio$.pipe(map(b => b.library));
        break;
      default:
        lib = this.imaginaireBiblio$.pipe(map(b => b.library));
    }
    return lib;
  }
}
