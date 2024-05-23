import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  categories: Array<Category> = [];
  showProducts(category: Category) {
    this.router.navigateByUrl('/products?category=' + category._id);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.data.error) {
          if (response.data.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.data.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.categories = response.data.data.categories;
        }
      },
    });
  }
}
