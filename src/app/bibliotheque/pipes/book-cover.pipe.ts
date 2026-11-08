import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/compat/storage';

@Pipe({
    name: 'bookCover',
    standalone: false
})
export class BookCoverPipe implements PipeTransform {

  constructor(private afs: AngularFireStorage) {
  }

  transform(libPath: string, coverName: string): Observable<string> {
    return this.afs.ref(`assets/books/covers/${libPath}/${coverName}`).getDownloadURL();
  }
}
