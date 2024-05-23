import { Component, inject } from '@angular/core';
import { Product } from '../../../../interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-store-products',
  templateUrl: './store-products.component.html',
  styleUrl: './store-products.component.css',
})
export class StoreProductsComponent {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  productService: ProductService = inject(ProductService);
  router: Router = inject(Router);
  message: string = '';
  products: Array<Product> = [];
  categories: Array<Category> = [];
  page: number = 1;
  loading: boolean = false;
  query: string = '';
  id: string = '';
  selected: Product | null = null;
  onCLose() {
    this.selected = null;
  }

  selectProduct(product: Product) {
    this.selected = product;
  }

  length: Array<number> = [1];

  onQuery(query: string) {
    window.scroll({ top: 0 });
    this.query = query;
    this.router.navigate([], { queryParams: {} });
    this.page = 1;
    this.loading = true;
    this.productService.getProducts(this.query + this.page).subscribe({
      next: (response: any) => {
        this.products = response.data.products;

        this.length = Array.from(
          {
            length: response.totalPages === 0 ? 1 : response.totalPages,
          },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  setPage(value: number): void {
    this.page = value;
    this.loading = true;

    this.productService.getProducts(this.query + this.page).subscribe({
      next: (response: any) => {
        this.products = response.data.products;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  increment(): void {
    if (this.page === this.length[this.length.length - 1]) {
      this.page = this.length[0];
    } else {
      this.page++;
    }
    this.loading = true;
    this.productService.getProducts(this.query + this.page).subscribe({
      next: (response: any) => {
        this.products = response.data.products;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  decrement(): void {
    if (this.page === this.length[0]) {
      this.page = this.length[this.length.length - 1];
    } else {
      this.page--;
    }
    this.loading = true;
    this.productService.getProducts(this.query + this.page).subscribe({
      next: (response: any) => {
        this.products = response.data.products;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.query =
      '?' +
      (this.router.url.includes('?category=')
        ? '' + this.router.url.split('products?')[1] + '&'
        : '') +
      'limit=10&page=';
    this.id = this.router.url.includes('?category=')
      ? this.router.url.split('?category=')[1]
      : '';
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.products.error) {
          if (response.products.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.products.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.products = response.products.data.products;
          this.categories = response.categories.data.categories;
          this.length = Array.from(
            {
              length:
                response.products.totalPages === 0
                  ? 1
                  : response.products.totalPages,
            },
            (_, i) => i + 1
          );
        }
      },
    });
  }
}
