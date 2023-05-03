import {TestBed} from '@angular/core/testing';

import {NautismeDatabaseService} from './nautisme-database.service';

describe('NautismeDatabaseService', () => {
  let service: NautismeDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NautismeDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
