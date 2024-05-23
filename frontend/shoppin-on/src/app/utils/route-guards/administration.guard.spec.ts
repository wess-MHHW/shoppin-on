import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { administrationGuard } from './administration.guard';

describe('administrationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => administrationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
