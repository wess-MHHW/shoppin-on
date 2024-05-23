import { ResolveFn } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const AdminMenuResolve: ResolveFn<any> = (route, state) => {
  const orderService: OrderService = inject(OrderService);
  return orderService.getStats().pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
