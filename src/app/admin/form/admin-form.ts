import {AdminField, AdminFormValue, AdminFormValues} from './admin-form.model';

type Stored = Record<string, unknown>;

function isRecord(value: unknown): value is Stored {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readPath(stored: Stored, key: string): unknown {
  return key.split('.').reduce<unknown>((current, segment) => (isRecord(current) ? current[segment] : undefined), stored);
}

function writePath(stored: Stored, key: string, value: unknown): void {
  const segments = key.split('.');
  const last = segments.pop() as string;
  let current = stored;
  for (const segment of segments) {
    current[segment] = isRecord(current[segment]) ? {...(current[segment] as Stored)} : {};
    current = current[segment] as Stored;
  }
  current[last] = value;
}

function removePath(stored: Stored, key: string): void {
  const segments = key.split('.');
  const last = segments.pop() as string;
  let current = stored;
  const parents: Stored[] = [];
  for (const segment of segments) {
    if (!isRecord(current[segment])) {
      return;
    }
    current[segment] = {...(current[segment] as Stored)};
    parents.push(current);
    current = current[segment] as Stored;
  }
  delete current[last];
  // A nested object left empty by the removal goes away too.
  segments.reverse().forEach((segment, index) => {
    const parent = parents[parents.length - 1 - index];
    if (Object.keys(parent[segment] as Stored).length === 0) {
      delete parent[segment];
    }
  });
}

function isEmpty(value: AdminFormValue | undefined): boolean {
  return value === null || value === undefined || value === '';
}

/** What each field of the form shows for a stored item (nothing yet when adding). */
export function toFormValues(source: Stored | undefined, fields: ReadonlyArray<AdminField>): AdminFormValues {
  const values: AdminFormValues = {};
  for (const field of fields) {
    const stored = source ? readPath(source, field.key) : undefined;
    if (field.kind === 'checkbox') {
      values[field.key] = Boolean(stored);
    } else if (field.kind === 'number') {
      const parsed = stored === undefined || stored === null || stored === '' ? NaN : Number(stored);
      values[field.key] = Number.isFinite(parsed) ? parsed : null;
    } else {
      values[field.key] = stored === undefined || stored === null ? '' : String(stored);
    }
  }
  return values;
}

/**
 * The stored entry once the form is saved: the source overlaid with the form's values. Fields the form does not
 * show (themes, flags, whatever an import left) are kept as they are, and a value left as it was keeps its stored
 * representation (an imported `"14"` stays `"14"` unless the number actually changed). A cleared field is removed.
 */
export function toStoredEntry(source: Stored | undefined, values: AdminFormValues, fields: ReadonlyArray<AdminField>): Stored {
  const entry: Stored = {...(source ?? {})};
  for (const field of fields) {
    const value = values[field.key];
    const previous = readPath(entry, field.key);
    if (field.kind === 'checkbox') {
      if (value === true || previous !== undefined) {
        writePath(entry, field.key, value === true);
      }
    } else if (isEmpty(value)) {
      removePath(entry, field.key);
    } else if (field.kind === 'number' && previous !== undefined && Number(previous) === value) {
      continue;
    } else {
      writePath(entry, field.key, value);
    }
  }
  return entry;
}

/** Whether `key` is already used by another item. `ownKey` is the key of the item being edited. */
export function isKeyTaken(key: string, existingKeys: ReadonlyArray<string>, ownKey?: string): boolean {
  return key !== ownKey && existingKeys.includes(key);
}
