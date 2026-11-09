import {Injectable, inject} from '@angular/core';
import {Firestore, collection, collectionData, doc, setDoc} from '@angular/fire/firestore';
import {catchError, Observable, of, shareReplay} from 'rxjs';
import {CseUser} from '../../models/users.model';

/** Employee directory: only readable by super admins, hence loaded lazily and never for visitors. */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly firestore = inject(Firestore);

  readonly userList$: Observable<Array<CseUser>> = (collectionData(collection(this.firestore, 'users')) as Observable<Array<CseUser>>).pipe(
    catchError(error => {
      console.error('Unable to load the employees', error);
      return of([] as Array<CseUser>);
    }),
    shareReplay({bufferSize: 1, refCount: true})
  );

  addUser(newUser: CseUser): Promise<void> {
    return setDoc(doc(this.firestore, 'users', newUser.id), newUser);
  }
}
