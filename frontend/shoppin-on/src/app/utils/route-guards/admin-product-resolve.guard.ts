import { ResolveFn } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const AdminProductResolve: ResolveFn<any> = (route, state) => {
  const productService: ProductService = inject(ProductService);

  if (state.url.includes('/products?category=')) {
    return productService
      .getProducts(
        '?limit=10&page=1&category=' + state.url.split('category=')[1]
      )
      .pipe(
        catchError((error) => {
          return of(error);
        })
      );
  }

  if (state.url === '/products') {
    return productService.getProducts('?limit=10&page=1').pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  return productService.getProducts('?limit=5&page=1').pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
