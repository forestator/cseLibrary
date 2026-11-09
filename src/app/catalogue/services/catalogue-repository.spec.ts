import {BRICOLAGE_CONFIG, NAUTISME_CONFIG} from '../models/commission-configs';
import {toCategorizedCollection, toCollection, toStored} from './catalogue-mapper';

describe('catalogue mapper', () => {
  it('keys items of all categories by category and id, in config order', () => {
    const items = toCategorizedCollection(BRICOLAGE_CONFIG, {
      Jardinage: {7: {name: 'Tondeuse'}},
      bois: {1: {name: 'Scie', status: 'HS'}},
    });

    expect(Object.keys(items)).toEqual(['bois/1', 'Jardinage/7']);
    expect(items['bois/1']).toEqual({id: '1', name: 'Scie', status: 'HS', categoryId: 'bois'});
  });

  it('defaults the status of flat commissions', () => {
    const items = toCollection(NAUTISME_CONFIG, {5: {name: 'Paddle'}});

    expect(items['5'].status).toBe('AVAILABLE');
  });

  it('stores the category id under the field name the data uses', () => {
    const stored = toStored(BRICOLAGE_CONFIG, {id: '1', name: 'Scie', categoryId: 'bois'});

    expect(stored[BRICOLAGE_CONFIG.categoryField ?? 'categoryId']).toBe('bois');
  });
});
