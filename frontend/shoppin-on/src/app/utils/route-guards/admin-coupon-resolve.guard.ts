import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CouponService } from '../../services/coupon.service';
import { catchError, of } from 'rxjs';

export const AdminCouponResolve: ResolveFn<any> = (route, state) => {
  const couponService: CouponService = inject(CouponService);
  return couponService.getCoupons().pipe(
    catchError((error: any) => {
      return of(error);
    })
  );
};
