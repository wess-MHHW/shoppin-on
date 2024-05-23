import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

export const administrationGuard: CanActivateFn = (route, state) => {
  const service: AdminService = inject(AdminService);
  const router: Router = inject(Router);
  return service.user.getValue() === null
    ? router.createUrlTree(['', 'login'])
    : true;
};
