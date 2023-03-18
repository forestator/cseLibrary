import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiblioDatabaseService {

  constructor(private afs: AngularFireStorage) { }

  getCoverUrl(libPath: string, coverName: string): Observable<string> {
    return this.afs.ref(`assets/books/covers/${libPath}/${coverName}`).getDownloadURL();
  }
}
