import {Injector} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {firstValueFrom, of} from 'rxjs';
import {BRICOLAGE_CONFIG, NAUTISME_CONFIG} from '../models/commission-configs';
import {CatalogueRepository} from './catalogue-repository';

function fakeDatabase(data: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  const database = {
    object: (path: string) => ({
      valueChanges: () => of(data[path]),
      update: (value: unknown) => Promise.resolve(void (updates[path] = value)),
      remove: () => Promise.resolve(),
    }),
  } as unknown as AngularFireDatabase;
  return {database, updates};
}

describe('CatalogueRepository', () => {
  it('keys items of all categories by category and id, in config order', async () => {
    const {database} = fakeDatabase({
      'bricolage/tools': {Jardinage: {7: {name: 'Tondeuse'}}, bois: {1: {name: 'Scie', status: 'HS'}}},
    });
    const repository = new CatalogueRepository(BRICOLAGE_CONFIG, database, Injector.create({providers: []}));

    const items = await firstValueFrom(repository.allItems$);

    expect(Object.keys(items)).toEqual(['bois/1', 'Jardinage/7']);
    expect(items['bois/1']).toEqual({id: '1', name: 'Scie', status: 'HS', categoryId: 'bois'});
  });

  it('defaults the status of flat commissions and writes without undefined values', async () => {
    const {database, updates} = fakeDatabase({'nautisme/items': {5: {name: 'Paddle'}}});
    const repository = new CatalogueRepository(NAUTISME_CONFIG, database, Injector.create({providers: []}));

    const items = await firstValueFrom(repository.allItems$);
    expect(items['5'].status).toBe('AVAILABLE');

    await repository.add({id: '5', name: 'Paddle', cover: undefined});
    expect(updates['nautisme/items/5']).toEqual({id: '5', name: 'Paddle'});
  });
});
