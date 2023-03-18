import {TestBed} from '@angular/core/testing';

import {BiblioDatabaseService} from './biblio-database.service';

describe('BiblioDatabaseService', () => {
  let service: BiblioDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiblioDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
