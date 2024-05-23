import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProductService } from '../../services/product.service';

export const BestSellersResolve: ResolveFn<any> = (route, state) => {
  const productService: ProductService = inject(ProductService);
  return productService.getBestSellersProducts().pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
