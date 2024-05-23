import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../interfaces/order';
import { OrderService } from '../../../../services/order.service';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrl: './orders-admin.component.css',
})
export class OrdersAdminComponent {
  selected = 'All';
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  orders: Array<Order> = [];
  orderService: OrderService = inject(OrderService);
  stats: any = {
    processing: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  page: number = 1;
  length: Array<number> = [1];
  query: string = '?limit=10&page=';

  loading = false;

  onChange(status: string) {
    window.scroll({ top: 0 });
    this.selected = status;
    this.query =
      (status === 'All' ? '' : '?status=' + status) +
      (status === 'All' ? '?' : '&') +
      'limit=10&page=';
    this.page = 1;
    this.loading = true;
    this.orderService.getAllOrders(this.query + this.page).subscribe({
      next: (response: any) => {
        this.orders = response.data.orders;

        this.length = Array.from(
          {
            length: response.totalPages === 0 ? 1 : response.totalPages,
          },
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

  goNextState(order: Order) {
    this.loading = true;
    let i = this.orders.findIndex((item) => item._id === order._id);
    let states: Array<string> = [
      'Processing',
      'Confirmed',
      'Shipped',
      'Delivered',
    ];
    let index = states.findIndex((item) => {
      return item === order.status;
    });

    this.orderService
      .updateOrderStatus(order._id, states[index + 1])
      .subscribe({
        next: (response: any) => {
          this.orders[i].status = states[index + 1];
          if (states[index] === 'Processing') {
            this.orderService.processing.next(
              this.stats[states[index].toLowerCase()] - 1
            );
          }
          if (states[index] === this.selected) {
            this.orders.splice(i, 1);
          }

          this.stats[states[index].toLowerCase()]--;
          this.stats[states[index + 1].toLowerCase()]++;
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

  goPreviousState(order: Order) {
    this.loading = true;
    let i = this.orders.findIndex((item) => item._id === order._id);
    let states: Array<string> = [
      'Processing',
      'Confirmed',
      'Shipped',
      'Delivered',
    ];
    let index = states.findIndex((item) => {
      return item === order.status;
    });
    this.orderService
      .updateOrderStatus(order._id, states[index - 1])
      .subscribe({
        next: (response: any) => {
          this.orders[i].status = states[index - 1];
          if (states[index] === 'Confirmed') {
            this.orderService.processing.next(
              this.stats[states[index - 1].toLowerCase()] + 1
            );
          }
          if (states[index] === this.selected) {
            this.orders.splice(i, 1);
          }
          this.stats[states[index].toLowerCase()]--;
          this.stats[states[index - 1].toLowerCase()]++;
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

  goPreviousPage() {
    if (this.page > 1) {
      this.page--;
    }
    this.loading = true;
    this.orderService.getAllOrders(this.query + this.page).subscribe({
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

  setPage(i: number) {
    this.page = i;
    this.loading = true;

    this.orderService.getAllOrders(this.query + this.page).subscribe({
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

  goNextPage() {
    if (this.page < this.length.length) {
      this.page++;
    }
    this.loading = true;
    this.orderService.getAllOrders(this.query + this.page).subscribe({
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

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.orders.error) {
          if (response.orders.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.orders.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.orders = response.orders.data.orders;
          this.stats = response.stats.data;
          this.length = Array.from(
            {
              length:
                response.orders.totalPages === 0
                  ? 1
                  : response.orders.totalPages,
            },
            (_, i) => i + 1
          );

          this.orderService.processing.next(this.stats.processing);
        }
      },
    });
  }
}
