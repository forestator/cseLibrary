import {TestBed} from '@angular/core/testing';

import {GamesOfConcolesResolver} from './games-of-concoles.resolver';

describe('GamesOfConcolesResolver', () => {
  let resolver: GamesOfConcolesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GamesOfConcolesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
