import { TestBed } from '@angular/core/testing';

import { CanDeactivateJuegoDeEvaluacionService } from './can-deactivate-juego-de-evaluacion.service';

describe('CanDeactivateJuegoDeEvaluacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanDeactivateJuegoDeEvaluacionService = TestBed.get(CanDeactivateJuegoDeEvaluacionService);
    expect(service).toBeTruthy();
  });
});
