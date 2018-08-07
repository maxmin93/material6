import { TestBed, inject } from '@angular/core/testing';

import { AgensUtilService } from './agens-util.service';

describe('AgensUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgensUtilService]
    });
  });

  it('should be created', inject([AgensUtilService], (service: AgensUtilService) => {
    expect(service).toBeTruthy();
  }));
});
