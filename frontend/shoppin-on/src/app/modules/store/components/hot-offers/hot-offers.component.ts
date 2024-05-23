import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-hot-offers',
  templateUrl: './hot-offers.component.html',
  styleUrl: './hot-offers.component.css',
})
export class HotOffersComponent {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  products: Array<Product> = [];
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
