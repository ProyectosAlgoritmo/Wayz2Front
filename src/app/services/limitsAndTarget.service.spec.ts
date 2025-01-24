/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LimitsAndTargetService } from './limitsAndTarget.service';

describe('Service: LimitsAndTarget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LimitsAndTargetService]
    });
  });

  it('should ...', inject([LimitsAndTargetService], (service: LimitsAndTargetService) => {
    expect(service).toBeTruthy();
  }));
});
