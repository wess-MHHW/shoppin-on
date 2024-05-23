import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { SavedService } from '../../../../services/saved.service';
import { CartService } from '../../../../services/cart.service';
import { Product } from '../../../../interfaces/product';
import { setLsItem } from '../../../../utils/functions/set-local-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  cartService: CartService = inject(CartService);
  savedService: SavedService = inject(SavedService);
  router: Router = inject(Router);
  adminService: AdminService = inject(AdminService);
  hover: boolean = false;
  savedNumber!: number;
  cartNumber!: number;
  total: number = 0;
  cart!: Array<{ product: Product; quantity: number }>;

  login() {
    if (this.adminService.user.getValue()) {
      this.router.navigate(['administration']);
    } else {
      this.router.navigate(['', 'login']);
    }
  }

  goTocart() {
    this.router.navigate(['', 'order']);
  }

  favorites() {
    this.router.navigate(['', 'favorites']);
  }

  showCart() {
    this.hover = true;
  }

  closeCart() {
    this.hover = false;
  }

  caclculateTotal() {
    this.total = 0;
    this.cart.forEach((item: { product: Product; quantity: number }) => {
      this.total +=
        item.quantity * item.product.price * (1 - item.product.discount);
    });
    return this.total;
  }

  incrementQuantity(index: number) {
    if (this.cart[index].product.quantity >= this.cart[index].quantity + 1) {
      this.cart[index].quantity++;
      this.cartService.cart.next(this.cart);
      setLsItem('cart', this.cart);
      this.caclculateTotal();
    }
  }
  decrememntQuantity(index: number) {
    if (this.cart[index].quantity - 1 > 0) {
      this.cart[index].quantity--;
      setLsItem('cart', this.cart);
      this.cartService.cart.next(this.cart);
      this.caclculateTotal();
    } else {
      this.removeProduct(index);
    }
  }
  removeProduct(index: number) {
    this.cart.splice(index, 1);
    setLsItem('cart', this.cart);
    this.cartService.cart.next(this.cart);
    this.caclculateTotal();
  }

  ngOnInit() {
    this.savedService.saved.subscribe((value: number) => {
      this.savedNumber = value;
    });
    this.cartService.cart.subscribe(
      (value: Array<{ product: Product; quantity: number }>) => {
        this.cartNumber = value.length;
        this.cart = value;
        this.caclculateTotal();
      }
    );
  }
}
