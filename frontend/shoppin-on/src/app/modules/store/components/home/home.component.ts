import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../../interfaces/category';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selected: Product | null = null;
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  categories: Array<Category> = [];
  products: Array<Product> = [];

  onCLose() {
    this.selected = null;
  }

  showProducts(category: Category) {
    this.router.navigateByUrl('/products?category=' + category._id);
  }

  navigateTo(destination: string) {
    this.router.navigate([destination]);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.categories.error) {
          if (response.categories.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.categories.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.products = response.products.data.products;

          this.categories = response.categories.data.categories;
        }
      },
    });
  }

  selectProduct(product: Product) {
    this.selected = product;
  }
}
