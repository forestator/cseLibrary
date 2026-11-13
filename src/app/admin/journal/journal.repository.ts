import {inject, Injectable} from '@angular/core';
import {Firestore, Timestamp, addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp} from '@angular/fire/firestore';
import {firstValueFrom, from, map, Observable} from 'rxjs';
import {AuthentificationService} from '../../services/firebase/authentification.service';
import {JournalEntry} from './journal-entry';

/** An entry as it was stored: who, when, and what. */
export interface JournalRecord extends JournalEntry {
  id: string;
  uid: string;
  email: string;
  at: Date;
}

/**
 * Single access point to the journal of changes (Firestore collection `journal`). Entries are only ever added: the
 * rules refuse any update or deletion, and only super-administrators can read them.
 */
@Injectable({providedIn: 'root'})
export class JournalRepository {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthentificationService);

  /** Writes an entry as the signed-in administrator, dated by the server. */
  async log(entry: JournalEntry): Promise<void> {
    const user = await firstValueFrom(this.auth.currentUser$);
    if (!user) {
      return;
    }
    await addDoc(collection(this.firestore, 'journal'), {...entry, uid: user.uid, email: user.email ?? '', at: serverTimestamp()});
  }

  /** The latest entries, newest first. */
  recent$(maximum = 500): Observable<JournalRecord[]> {
    return from(getDocs(query(collection(this.firestore, 'journal'), orderBy('at', 'desc'), limit(maximum)))).pipe(
      map(snapshot => snapshot.docs.map(document => {
        const data = document.data() as Omit<JournalRecord, 'id' | 'at'> & {at: Timestamp};
        return {...data, id: document.id, at: data.at.toDate()};
      })));
  }
}
