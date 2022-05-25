import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { Author } from 'src/app/models/author.model';


@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  public authors: Array<Author>;
  constructor(private db: AngularFirestore) { 
    this.authors = [];
  }

  public getAuthors(): Observable<Array<Author>>{
    return new Observable<Array<Author>>(observer => {
      const shirts = this.db.collection('authors').snapshotChanges().subscribe(actions => {
        this.authors = [];
        actions.forEach(a => {
          const author:Author = a.payload.doc.data() as Author;
          author.id = a.payload.doc.id;
          this.authors.push(author);
        });
        observer.next(this.authors);
      });
    });
  }

  public addAuthor(author: Author): Observable<any>{
    return from(this.db.collection('authors').add(author));
  }

  public updateAuthor(author: Author): Observable<any> {
    return from(this.db.collection('authors').doc(author.id).update(author));
  }

  public removeAuthor(author: Author): Observable<any> {
    return from(this.db.collection('authors').doc(author.id).delete());
  }
}
