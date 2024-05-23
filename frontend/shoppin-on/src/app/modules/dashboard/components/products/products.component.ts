import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Category } from '../../../../interfaces/category';
import { Product } from '../../../../interfaces/product';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  productService: ProductService = inject(ProductService);
  selected: Category = { _id: '', name: 'None', photo: '' };
  products: Array<Product> = [];
  length: Array<number> = [1];
  product: any | null = null;
  total: number = 0;
  page: number = 1;
  role: string = '';
  loading: boolean = false;
  show: boolean = false;
  message: string = '';
  search: string = '';

  searchProducts(form: NgForm) {
    this.search = form.value.search;
    this.page = 1;
    this.loading = true;
    this.productService
      .getProducts(
        '?limit=5&page=' +
          this.page.toString() +
          (this.search ? '&name=' + this.search : '')
      )
      .subscribe({
        next: (response: any) => {
          this.products = response.data.products;
          this.total = response.length;
          this.length = Array.from(
            { length: response.totalPages },
            (_, i) => i + 1
          );
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

  openDilaog(role: string, product: any | null) {
    this.show = true;
    this.role = role;
    this.product = product;
    this.selected = product?.category ?? { _id: '', name: 'None', photo: '' };
  }

  onCreate(event: any) {
    this.productService.createProduct(event).subscribe({
      next: (response: any) => {
        if (this.page === 1) {
          this.products.unshift(response.data.product);
          this.products.pop();
          this.total++;
          this.loading = false;
        }
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

  onDelete(id: any) {
    this.loading = true;
    let index = this.products.findIndex((item) => item._id === id);
    this.productService.deleteProduct(id).subscribe({
      next: (data: any) => {
        this.products.splice(index, 1);
        this.total--;
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

  onEdit(event: any) {
    let index = this.products.findIndex(
      (item: Product) => item._id === this.product._id
    );
    this.loading = true;
    this.productService.updateProduct(this.product._id, event).subscribe({
      next: (response: any) => {
        this.products[index] = response.data.product;
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

  onClose(event: any): void {
    this.show = false;
  }

  increment(): void {
    if (this.page === this.length[this.length.length - 1]) {
      this.page = this.length[0];
    } else {
      this.page++;
    }
    this.loading = true;

    this.productService
      .getProducts(
        '?limit=5&page=' +
          this.page.toString() +
          (this.search ? '&name=' + this.search : '')
      )
      .subscribe({
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
    this.productService
      .getProducts(
        '?limit=5&page=' +
          this.page.toString() +
          (this.search ? '&name=' + this.search : '')
      )
      .subscribe({
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

  setPage(value: number): void {
    this.page = value;
    this.loading = true;

    this.productService
      .getProducts(
        '?limit=5&page=' +
          this.page.toString() +
          (this.search ? '&name=' + this.search : '')
      )
      .subscribe({
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

  ngOnInit(): void {
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
          this.products = response.data.data.products;
          this.total = response.data.length;
          this.length = Array.from(
            { length: response.data.totalPages },
            (_, i) => i + 1
          );
        }
      },
    });
  }
}
