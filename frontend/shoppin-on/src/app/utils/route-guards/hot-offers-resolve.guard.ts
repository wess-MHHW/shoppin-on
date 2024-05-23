import { ResolveFn } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const HotOffersResolve: ResolveFn<any> = (route, state) => {
  const productService: ProductService = inject(ProductService);

  return productService.getProducts('?discount[gt]=0').pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
