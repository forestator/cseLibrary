import {inject, Injectable} from '@angular/core';
import {Firestore, arrayUnion, doc, getDoc, setDoc} from '@angular/fire/firestore';

/**
 * What the user decided during reconciliations (Firestore document `reconciliation/decisions`), so that a line they said
 * to stop proposing does not come back with the next export. Reserved to the super-administrators by the rules.
 */
@Injectable({providedIn: 'root'})
export class ReconciliationRepository {
  private readonly firestore = inject(Firestore);
  private readonly decisions = doc(this.firestore, 'reconciliation', 'decisions');

  /** The lines never to be proposed again: `ov_id` of the software, or `barcode|title` when a line has none. */
  async loadIgnoredLines(): Promise<Set<string>> {
    const snapshot = await getDoc(this.decisions);
    return new Set((snapshot.data()?.['ignoredLines'] as string[] | undefined) ?? []);
  }

  async ignoreLines(lines: ReadonlyArray<string>): Promise<void> {
    await setDoc(this.decisions, {ignoredLines: arrayUnion(...lines)}, {merge: true});
  }
}
