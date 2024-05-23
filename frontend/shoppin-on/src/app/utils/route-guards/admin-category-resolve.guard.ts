import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { catchError, of } from 'rxjs';

export const AdminCategoryResolve: ResolveFn<any> = (route, state) => {
  const categoryService = inject(CategoryService);
  return categoryService.getCategories().pipe(
    catchError((error: any) => {
      return of(error);
    })
  );
};
