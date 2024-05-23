import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { AdminService } from '../../services/admin.service';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  let adminService: AdminService = inject(AdminService);
  return adminService.user.pipe(
    take(1),
    exhaustMap((admin) => {
      if (!admin) {
        return next(req);
      }
      const modified = req.clone({
        setHeaders: { Authorization: `Bearer ${admin.token}` },
      });
      return next(modified);
    })
  );
};
