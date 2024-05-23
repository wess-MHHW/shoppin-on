import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css',
})
export class BestSellersComponent {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  products: Array<any> = [];
  selected: Product | null = null;

  onCLose() {
    this.selected = null;
  }

  selectProduct(product: Product) {
    this.selected = product;
  }

  ngOnInit() {
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
        }
      },
    });
  }
}
