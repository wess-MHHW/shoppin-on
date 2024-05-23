import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const service: AdminService = inject(AdminService);
  const router: Router = inject(Router);
  return service.user.getValue() !== null
    ? router.createUrlTree(['administration'])
    : true;
};
