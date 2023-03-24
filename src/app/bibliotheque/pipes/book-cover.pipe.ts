import {Pipe, PipeTransform} from '@angular/core';
import {Observable, take} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/compat/storage';

@Pipe({
  name: 'bookCover'
})
export class BookCoverPipe implements PipeTransform {

  constructor(private afs: AngularFireStorage) {
  }

  transform(libPath: string, coverName: string): Observable<string> {
    return this.afs.ref(`assets/books/covers/${libPath}/${coverName}`).getDownloadURL().pipe(take(1));
  }
}
