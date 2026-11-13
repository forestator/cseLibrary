import {DocumentReference, FieldPath, deleteField, setDoc, updateDoc} from '@angular/fire/firestore';

// Catalogue documents hold whole maps (games by ref, items by category and id), so single entries are
// addressed by a path of field names. A FieldPath keeps ids with special characters (dots, ampersands) intact.

const nestedObject = (path: ReadonlyArray<string>, value: unknown): Record<string, unknown> =>
  path.reduceRight<unknown>((inner, key) => ({[key]: inner}), value) as Record<string, unknown>;

// Firestore rejects undefined values, which are meaningless in an update anyway.
const withoutUndefined = <T extends object>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, field]) => field !== undefined)) as T;

// A null field means "remove it" in a merge, as it did in the Realtime Database.
const nullsAsDeletions = (value: object): object =>
  Object.fromEntries(Object.entries(value).map(([key, field]) => [key, field === null ? deleteField() : field]));

const withoutNulls = (value: object): object =>
  Object.fromEntries(Object.entries(value).filter(([, field]) => field !== null));

/** Merges fields into the entry at `path`, creating it when missing (like a Realtime Database update). */
export function mergeAtPath(reference: DocumentReference, path: ReadonlyArray<string>, value: object): Promise<void> {
  return setDoc(reference, nestedObject(path, nullsAsDeletions(withoutUndefined(value))), {merge: true});
}

/** Replaces the whole entry at `path` (like a Realtime Database set). */
export function replaceAtPath(reference: DocumentReference, path: ReadonlyArray<string>, value: object): Promise<void> {
  return updateDoc(reference, new FieldPath(...path), withoutNulls(withoutUndefined(value)));
}

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
