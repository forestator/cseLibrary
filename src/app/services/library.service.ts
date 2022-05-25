import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { Library } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private readonly BD_LIBRARY_IDENTIFIER: string = 'libraries';
  public libraries: Array<Library>;
  constructor(private db: AngularFirestore) { 
    this.libraries = [];
  }

  public getLibraries(): Observable<Array<Library>>{
    return new Observable<Array<Library>>(observer => {
      const shirts = this.db.collection(this.BD_LIBRARY_IDENTIFIER).snapshotChanges().subscribe(actions => {
        this.libraries = [];
        actions.forEach(a => {
          const lib:Library = a.payload.doc.data() as Library;
          lib.id = a.payload.doc.id;
          this.libraries.push(lib);
        });
        observer.next(this.libraries);
      });
    });
  }

  public addLibrary(library: Library): Observable<any>{
    return from(this.db.collection(this.BD_LIBRARY_IDENTIFIER).add(library));
  }

  public updateLibrary(library: Library): Observable<any> {
    return from(this.db.collection(this.BD_LIBRARY_IDENTIFIER).doc(library.id).update(library));
  }

  public removeLibrary(library: Library): Observable<any> {
    return from(this.db.collection(this.BD_LIBRARY_IDENTIFIER).doc(library.id).delete());
  }
}
