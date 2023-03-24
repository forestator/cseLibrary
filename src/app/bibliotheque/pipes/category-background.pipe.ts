import {Pipe, PipeTransform} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {catchError, Observable, take} from 'rxjs';

@Pipe({
  name: 'categoryBackground'
})
export class CategoryBackgroundPipe implements PipeTransform {

  constructor(private afs: AngularFireStorage) {
  }

  transform(libPath: string, bgName: string): Observable<string> {
    return this.afs.ref(`assets/books/categoriesBackground/${libPath}/${bgName}`).getDownloadURL()
      .pipe(
        take(1),
        catchError(err => {
          return this.afs.ref(`assets/books/categoriesBackground/defaultCatBg.jpg`).getDownloadURL();
        })
      );
  }
}
