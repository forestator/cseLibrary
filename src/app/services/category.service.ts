import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { Category, Library } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly BD_CATEGORY_IDENTIFIER: string = 'categories';
  public categories: Array<Category>;
  constructor(private db: AngularFirestore) { 
    this.categories = [];
  }

  public getCategoriesOfLibrary(library: Library): Observable<Array<Category>>{
    return new Observable<Array<Category>>(observer => {
      const shirts = this.db.collection(this.BD_CATEGORY_IDENTIFIER).snapshotChanges().subscribe(actions => {
        this.categories = [];
        actions.forEach(a => {
          const cat:Category = a.payload.doc.data() as Category;
          if (cat.parentId === library.id) {
            cat.id = a.payload.doc.id;
            this.categories.push(cat);
          }
        });
        observer.next(this.categories);
      });
    });
  }

  public addCategory(category: Category): Observable<any>{
    return from(this.db.collection(this.BD_CATEGORY_IDENTIFIER).add(category));
  }

  public updateCategory(category: Category): Observable<any> {
    return from(this.db.collection(this.BD_CATEGORY_IDENTIFIER).doc(category.id).update(category));
  }

  public removeCategory(category: Category): Observable<any> {
    return from(this.db.collection(this.BD_CATEGORY_IDENTIFIER).doc(category.id).delete());
  }
}
