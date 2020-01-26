import { TestBed } from '@angular/core/testing';

import { CalculosService } from './calculos.service';

describe('CalculosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculosService = TestBed.get(CalculosService);
    expect(service).toBeTruthy();
  });
});
