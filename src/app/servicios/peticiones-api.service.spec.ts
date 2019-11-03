import { TestBed } from '@angular/core/testing';

import { PeticionesAPIService } from './peticiones-api.service';

describe('PeticionesAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeticionesAPIService = TestBed.get(PeticionesAPIService);
    expect(service).toBeTruthy();
  });
});
