import {Pipe, PipeTransform} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {catchError, Observable} from 'rxjs';

@Pipe({
    name: 'categoryBackground',
    standalone: false
})
export class CategoryBackgroundPipe implements PipeTransform {

  constructor(private afs: AngularFireStorage) {
  }

  transform(libPath: string, bgName: string): Observable<string> {
    return this.afs.ref(`assets/books/categoriesBackground/${libPath}/${bgName}`).getDownloadURL()
      .pipe(
        catchError(err => {
          return this.afs.ref(`assets/books/categoriesBackground/defaultCatBg.jpg`).getDownloadURL();
        })
      );
  }
}
