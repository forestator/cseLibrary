import {TestBed} from '@angular/core/testing';

import {StorageUploadService} from './storage-upload.service';

describe('StorageUploadService', () => {
  let service: StorageUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
