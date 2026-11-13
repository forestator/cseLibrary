import {AdminField} from '../form/admin-form.model';
import {deleteEntry, diffValues, saveEntry, statusEntry} from './journal-entry';

const FIELDS: ReadonlyArray<AdminField> = [
  {key: 'name', label: 'Nom', kind: 'text'},
  {key: 'status', label: 'Statut', kind: 'status', options: [{value: 'AVAILABLE', label: 'Disponible'}, {value: 'HS', label: 'Hors service'}]},
  {key: 'minAge', label: 'Âge mini', kind: 'number'},
  {key: 'isNew', label: 'Nouveauté', kind: 'checkbox'},
  {key: 'description', label: 'Description', kind: 'textarea'},
];
const subject = {commission: 'ludotheque', collection: 'boardGames', collectionLabel: 'Jeux de société'};

describe('diffValues', () => {
  it('lists only the fields that changed, with the labels the form shows', () => {
    const changes = diffValues(
      {name: 'Catan', status: 'AVAILABLE', minAge: 10, isNew: false, description: ''},
      {name: 'Catan', status: 'HS', minAge: 12, isNew: false, description: ''}, FIELDS);
    expect(changes).toEqual([
      {field: 'Statut', before: 'Disponible', after: 'Hors service'},
      {field: 'Âge mini', before: '10', after: '12'},
    ]);
  });

  it('treats a number and the same number as text as equal, and ignores surrounding spaces', () => {
    expect(diffValues({name: 'Catan ', minAge: '10'} as never, {name: 'Catan', minAge: 10}, FIELDS)).toEqual([]);
  });

  it('shows an empty value as a dash and booleans as Oui / Non', () => {
    const changes = diffValues({description: '', isNew: false}, {description: 'Un classique', isNew: true}, FIELDS);
    expect(changes).toEqual([
      {field: 'Nouveauté', before: 'Non', after: 'Oui'},
      {field: 'Description', before: '—', after: 'Un classique'},
    ]);
  });

  it('shortens a long value', () => {
    const [change] = diffValues({description: ''}, {description: 'x'.repeat(300)}, FIELDS);
    expect(change.after.length).toBeLessThan(130);
    expect(change.after.endsWith('…')).toBeTrue();
  });
});

describe('journal entries', () => {
  it('describes an addition without detail, and a modification with the fields changed', () => {
    expect(saveEntry(subject, 'Catan', [], true)).toEqual(jasmine.objectContaining({action: 'create', summary: 'Ajout de « Catan »', changes: []}));
    const update = saveEntry(subject, 'Catan', [{field: 'Statut', before: 'Disponible', after: 'Perdu'}], false);
    expect(update.action).toBe('update');
    expect(update.summary).toBe('Modification de « Catan » : Statut');
  });

  it('counts a bulk action and keeps only the first names', () => {
    const names = Array.from({length: 30}, (_, index) => `Jeu ${index}`);
    const entry = deleteEntry(subject, names);
    expect(entry).toEqual(jasmine.objectContaining({action: 'delete', itemName: '30 objets', count: 30}));
    expect(entry.names).toHaveSize(20);
  });

  it('words a status change for one item and for several', () => {
    expect(statusEntry(subject, ['Catan'], 'Perdu').summary).toBe('« Catan » passé à « Perdu »');
    expect(statusEntry(subject, ['A', 'B'], 'Perdu').summary).toBe('2 objets passés à « Perdu »');
  });
});
