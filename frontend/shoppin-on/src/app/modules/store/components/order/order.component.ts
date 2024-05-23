import { Component, ViewChild, inject } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { Product } from '../../../../interfaces/product';
import { CouponService } from '../../../../services/coupon.service';
import { Coupon } from '../../../../interfaces/coupon';
import { OrderService } from '../../../../services/order.service';
import { NgForm } from '@angular/forms';
import { setLsItem } from '../../../../utils/functions/set-local-storage';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  cartService: CartService = inject(CartService);
  cart!: Array<{ product: Product; quantity: number }>;
  fees: number = 7;
  code: Coupon | null = null;
  show: boolean = false;
  couponService: CouponService = inject(CouponService);
  orderService: OrderService = inject(OrderService);
  @ViewChild('personal') personal!: NgForm;
  message: string = '';
  adjust: any = null;
  loading = false;

  content =
    'Looks like your cart is empty! Head over to our store to browse some awesome products.';

  createOrder() {
    if (this.personal.valid) {
      this.loading = true;
      let data = this.personal.value;
      data['code'] = this.code;
      data['products'] = this.cart;

      this.orderService.createOrder(data).subscribe({
        next: (response: any) => {
          this.adjust = response.data.unavailable;
          if (response.data.hasOwnProperty('unavailable')) {
            let una: Array<string> = [];
            let uns: Array<string> = [];

            response.data.unavailable.forEach(
              (element: { _id: String; name: string; available: number }) => {
                if (element.available === 0) {
                  una.push(element.name.toUpperCase());
                } else {
                  uns.push(
                    element.name.toUpperCase() + '(' + element.available + ')'
                  );
                }
              }
            );

            this.message =
              "We've almost got your order ready, but we noticed a couple of things:\n" +
              una.join(', ') +
              (una.length !== 0
                ? ': Unfortunately, these are currently unavailable.\n'
                : '') +
              uns.join(', ') +
              (uns.length !== 0
                ? ': Unfortunately, We only have these quantities left in stock.\n'
                : '');
          } else {
            this.message = '';
            this.content =
              "We've received your order and it's being processed! We'll call you for confirmation as soon as possible.";
            this.adjust = null;
            this.cartService.cart.next([]);
            localStorage.removeItem('cart');
          }
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

  adjustOrder() {
    this.adjust.forEach((e: any) => {
      let index = this.cart.findIndex((item: any) => {
        return item.product._id === e._id;
      });
      if (e.available !== 0) {
        this.cart[index].quantity = e.available;
      } else {
        this.cart.splice(index, 1);
      }
    });
    this.message = '';
    setLsItem('cart', this.cart);
    this.cartService.cart.next(this.cart);
  }

  caclculateTotal(code?: Coupon | null) {
    let total = 0;
    this.cart.forEach((item: { product: Product; quantity: number }) => {
      total += item.quantity * item.product.price * (1 - item.product.discount);
    });
    if (code) {
      return total * (1 - code.value);
    }
    return total;
  }

  validateCoupon(input: HTMLInputElement) {
    this.loading = true;
    this.couponService.getCoupon(input.value.trim()).subscribe({
      next: (response: any) => {
        this.code = response.data.coupon;

        this.show = Boolean(!this.code);
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
    this.cartService.cart.subscribe(
      (value: Array<{ product: Product; quantity: number }>) => {
        this.cart = value;
      }
    );
  }
}
