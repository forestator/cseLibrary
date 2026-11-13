import {AdminField, AdminFormValue, AdminFormValues} from '../form/admin-form.model';

export type JournalAction = 'create' | 'update' | 'delete' | 'status' | 'structure';

export interface JournalChange {
  field: string;
  before: string;
  after: string;
}

/** What is written to the journal; the author and the date are added by the repository. */
export interface JournalEntry {
  action: JournalAction;
  commission: string;
  collection: string;
  collectionLabel: string;
  /** The item, or "3 objets" for a bulk action. */
  itemName: string;
  summary: string;
  changes: JournalChange[];
  count: number;
  /** Names of the items concerned by a bulk action (the first ones). */
  names: string[];
}

export const JOURNAL_ACTION_LABELS: Readonly<Record<JournalAction, string>> = {
  create: 'Ajout',
  update: 'Modification',
  delete: 'Suppression',
  status: 'Changement de statut',
  structure: 'Structure',
};

const MAX_VALUE_LENGTH = 120;
const MAX_LISTED_NAMES = 20;

function shown(field: AdminField, value: AdminFormValue | undefined): string {
  if (value === null || value === undefined || value === '') {
    return field.kind === 'checkbox' ? 'Non' : '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  const text = String(value);
  const label = field.options?.find(option => option.value === text)?.label ?? text;
  return label.length > MAX_VALUE_LENGTH ? `${label.slice(0, MAX_VALUE_LENGTH)}…` : label;
}

const comparable = (value: AdminFormValue | undefined): string => (value === null || value === undefined ? '' : String(value).trim());

/** The fields whose value differs between what the form showed and what was saved, in the words of the form. */
export function diffValues(before: AdminFormValues, after: AdminFormValues, fields: ReadonlyArray<AdminField>): JournalChange[] {
  return fields
    .filter(field => comparable(before[field.key]) !== comparable(after[field.key]) && !(field.kind === 'checkbox' && !before[field.key] && !after[field.key]))
    .map(field => ({field: field.label, before: shown(field, before[field.key]), after: shown(field, after[field.key])}));
}

interface Subject {
  commission: string;
  collection: string;
  collectionLabel: string;
}

export function saveEntry(subject: Subject, name: string, changes: JournalChange[], adding: boolean): JournalEntry {
  const fields = changes.map(change => change.field).join(', ');
  return {
    ...subject,
    action: adding ? 'create' : 'update',
    itemName: name,
    summary: adding ? `Ajout de « ${name} »` : `Modification de « ${name} » : ${fields}`,
    changes: adding ? [] : changes,
    count: 1,
    names: [],
  };
}

export function deleteEntry(subject: Subject, names: ReadonlyArray<string>): JournalEntry {
  const one = names.length === 1;
  return {
    ...subject,
    action: 'delete',
    itemName: one ? names[0] : `${names.length} objets`,
    summary: one ? `Suppression de « ${names[0]} »` : `Suppression de ${names.length} objets`,
    changes: [],
    count: names.length,
    names: names.slice(0, MAX_LISTED_NAMES),
  };
}

export function statusEntry(subject: Subject, names: ReadonlyArray<string>, statusLabel: string): JournalEntry {
  const one = names.length === 1;
  return {
    ...subject,
    action: 'status',
    itemName: one ? names[0] : `${names.length} objets`,
    summary: one ? `« ${names[0]} » passé à « ${statusLabel} »` : `${names.length} objets passés à « ${statusLabel} »`,
    changes: [],
    count: names.length,
    names: names.slice(0, MAX_LISTED_NAMES),
  };
}

export function structureEntry(libraryId: string, libraryName: string): JournalEntry {
  return {
    action: 'structure', commission: 'bibliotheque', collection: libraryId, collectionLabel: libraryName, itemName: libraryName,
    summary: `Structure de « ${libraryName} » modifiée (catégories, auteurs, séries ou éditeurs)`, changes: [], count: 1, names: [],
  };
}
