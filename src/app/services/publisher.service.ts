import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { Publisher } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  public publishers: Array<Publisher>;
  constructor(private db: AngularFirestore) { 
    this.publishers = [];
  }

  public getPublishers(): Observable<Array<Publisher>>{
    return new Observable<Array<Publisher>>(observer => {
      const shirts = this.db.collection('publishers').snapshotChanges().subscribe(actions => {
        this.publishers = [];
        actions.forEach(p => {
          const publisher:Publisher = p.payload.doc.data() as Publisher;
          publisher.id = p.payload.doc.id;
          this.publishers.push(publisher);
        });
        observer.next(this.publishers);
      });
    });
  }

  public addPublisher(publisher: Publisher): Observable<any>{
    return from(this.db.collection('publishers').add(publisher));
  }

  public updatePublisher(publisher: Publisher): Observable<any> {
    return from(this.db.collection('publishers').doc(publisher.id).update(publisher));
  }

  public removePublisher(publisher: Publisher): Observable<any> {
    return from(this.db.collection('publishers').doc(publisher.id).delete());
  }
}
