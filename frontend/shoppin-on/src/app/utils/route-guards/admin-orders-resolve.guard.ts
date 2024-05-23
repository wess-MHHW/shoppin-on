import { ResolveFn } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const AdminOrdersResolve: ResolveFn<any> = (route, state) => {
  const orderService: OrderService = inject(OrderService);
  return orderService.getAllOrders('?limit=10&page=1').pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
