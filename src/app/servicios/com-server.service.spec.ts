import { TestBed } from '@angular/core/testing';

import { ComServerService } from './com-server.service';

describe('ComServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComServerService = TestBed.get(ComServerService);
    expect(service).toBeTruthy();
  });
});
