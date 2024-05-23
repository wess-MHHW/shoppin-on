import { Component, inject } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import { Order } from '../../../../interfaces/order';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  message = '';
  loading = false;
  searched = false;
  orders: Array<Order> = [];
  orderService: OrderService = inject(OrderService);

  cancelOrder(order: Order) {
    this.loading = true;
    let index = this.orders.findIndex((e: Order) => {
      return e._id === order._id;
    });
    this.orderService.cancelOrder(order._id).subscribe({
      next: (response: any) => {
        this.orders[index].status = 'Cancelled';
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

  caclculateTotal(order: Order) {
    let total = 0;
    order.products.forEach((item: { product: Product; quantity: number }) => {
      total += item.quantity * item.product.price * (1 - item.product.discount);
    });
    if (order.code) {
      return total * (1 - order.code.value);
    }
    return total;
  }

  searchOrders(search: HTMLInputElement) {
    if (search.value) {
      this.loading = true;
      this.searched = true;
      this.orderService.getOrders(search.value).subscribe({
        next: (response: any) => {
          this.orders = response.data.orders;
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
  }
}
