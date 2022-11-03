import { TestBed } from '@angular/core/testing';

import { IpgeolocationService } from './ipgeolocation.service';

describe('IpgeolocationService', () => {
  let service: IpgeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpgeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
