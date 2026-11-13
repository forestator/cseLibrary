import {DocumentReference, FieldPath, deleteField, updateDoc} from '@angular/fire/firestore';

// Catalogue documents hold whole maps (games by ref, items by category and id), so single entries are
// addressed by a path of field names. A FieldPath keeps ids with special characters (dots, ampersands) intact.

// Firestore rejects undefined values, which are meaningless in an update anyway.
const withoutUndefined = <T extends object>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, field]) => field !== undefined)) as T;

const withoutNulls = (value: object): object =>
  Object.fromEntries(Object.entries(value).filter(([, field]) => field !== null));

export function removeAtPath(reference: DocumentReference, path: ReadonlyArray<string>): Promise<void> {
  return updateDoc(reference, new FieldPath(...path), deleteField());
}

/**
 * Writes the whole entry at `path`, and when `previousPath` is another place removes the entry that was there:
 * one atomic update, so a renamed or recategorised item can never be left behind as a duplicate.
 */
export function saveAtPath(
  reference: DocumentReference, path: ReadonlyArray<string>, value: object, previousPath?: ReadonlyArray<string>,
): Promise<void> {
  const entry = withoutNulls(withoutUndefined(value));
  if (!previousPath || previousPath.join('\u0000') === path.join('\u0000')) {
    return updateDoc(reference, new FieldPath(...path), entry);
  }
  return updateDoc(reference, new FieldPath(...path), entry, new FieldPath(...previousPath), deleteField());
}

/** Maximum number of entries changed by one update, well under what Firestore accepts in a single write. */
const UPDATE_CHUNK = 200;

export interface EntryUpdate {
  path: ReadonlyArray<string>;
  /** `undefined` removes the entry or field. */
  value: unknown;
}

/**
 * Applies many updates to one document with a single `updateDoc` per chunk, never one write per entry:
 * a bulk change of a hundred items is one round trip and one atomic write.
 */
export async function updateEntries(reference: DocumentReference, updates: ReadonlyArray<EntryUpdate>): Promise<void> {
  for (let start = 0; start < updates.length; start += UPDATE_CHUNK) {
    const [first, ...rest] = updates.slice(start, start + UPDATE_CHUNK);
    const asValue = (update: EntryUpdate): unknown => update.value === undefined ? deleteField() : update.value;
    await updateDoc(reference, new FieldPath(...first.path), asValue(first),
      ...rest.flatMap(update => [new FieldPath(...update.path), asValue(update)]));
  }
}
