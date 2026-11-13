import {isKeyTaken, toFormValues, toStoredEntry} from './admin-form';
import {AdminField} from './admin-form.model';

const FIELDS: ReadonlyArray<AdminField> = [
  {key: 'name', label: 'Nom', kind: 'text', required: true},
  {key: 'description', label: 'Description', kind: 'textarea'},
  {key: 'minAge', label: 'Âge mini', kind: 'number'},
  {key: 'isNew', label: 'Nouveauté', kind: 'checkbox'},
  {key: 'dimensions.longueur', label: 'Longueur', kind: 'text'},
  {key: 'dimensions.PV', label: 'PV', kind: 'text'},
];

describe('toFormValues', () => {
  it('shows empty values for an item being added', () => {
    expect(toFormValues(undefined, FIELDS)).toEqual({
      name: '', description: '', minAge: null, isNew: false, 'dimensions.longueur': '', 'dimensions.PV': '',
    });
  });

  it('reads stored values, numbers stored as text and nested fields included', () => {
    const values = toFormValues({name: 'Catan', minAge: '10', isNew: true, dimensions: {longueur: '3 m'}}, FIELDS);
    expect(values).toEqual(jasmine.objectContaining({name: 'Catan', minAge: 10, isNew: true, 'dimensions.longueur': '3 m'}));
  });
});

describe('toStoredEntry', () => {
  const values = (overrides: Record<string, string | number | boolean | null>) => ({
    name: 'Catan', description: '', minAge: null, isNew: false, 'dimensions.longueur': '', 'dimensions.PV': '', ...overrides,
  });

  it('keeps the fields the form does not show', () => {
    const entry = toStoredEntry({name: 'Catan', themes: ['commerce'], libraryId: 'boardGames'}, values({}), FIELDS);
    expect(entry['themes']).toEqual(['commerce']);
    expect(entry['libraryId']).toBe('boardGames');
  });

  it('keeps the stored representation of a number that did not change', () => {
    const entry = toStoredEntry({name: 'Catan', minAge: '14'}, values({minAge: 14}), FIELDS);
    expect(entry['minAge']).toBe('14');
  });

  it('writes a number that changed, and leaves an empty number out instead of writing null or NaN', () => {
    expect(toStoredEntry({name: 'Catan', minAge: '14'}, values({minAge: 12}), FIELDS)['minAge']).toBe(12);
    expect('minAge' in toStoredEntry(undefined, values({}), FIELDS)).toBeFalse();
  });

  it('removes a field that was cleared', () => {
    const entry = toStoredEntry({name: 'Catan', description: 'Un classique', minAge: 10}, values({minAge: null}), FIELDS);
    expect('description' in entry).toBeFalse();
    expect('minAge' in entry).toBeFalse();
  });

  it('writes nested fields and drops the nested object once it is empty', () => {
    const added = toStoredEntry({name: 'Remorque'}, values({'dimensions.longueur': '3 m'}), FIELDS);
    expect(added['dimensions']).toEqual({longueur: '3 m'});
    const cleared = toStoredEntry({name: 'Remorque', dimensions: {longueur: '3 m'}}, values({}), FIELDS);
    expect('dimensions' in cleared).toBeFalse();
  });

  it('does not touch the source object', () => {
    const source = {name: 'Remorque', dimensions: {longueur: '3 m'}};
    toStoredEntry(source, values({'dimensions.longueur': '4 m'}), FIELDS);
    expect(source.dimensions.longueur).toBe('3 m');
  });

  it('writes a checkbox that is ticked, and an unticked one only when it was stored', () => {
    expect(toStoredEntry(undefined, values({isNew: true}), FIELDS)['isNew']).toBeTrue();
    expect('isNew' in toStoredEntry(undefined, values({}), FIELDS)).toBeFalse();
    expect(toStoredEntry({name: 'Catan', isNew: true}, values({isNew: false}), FIELDS)['isNew']).toBeFalse();
  });
});

describe('isKeyTaken', () => {
  it('flags a key used by another item', () => {
    expect(isKeyTaken('ludo12', ['ludo12', 'ludo13'])).toBeTrue();
  });

  it('lets an item keep its own key', () => {
    expect(isKeyTaken('ludo12', ['ludo12', 'ludo13'], 'ludo12')).toBeFalse();
  });

  it('accepts a free key', () => {
    expect(isKeyTaken('ludo14', ['ludo12'])).toBeFalse();
  });
});
