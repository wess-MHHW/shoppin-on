import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  adminService: AdminService = inject(AdminService);
  activatedRout: ActivatedRoute = inject(ActivatedRoute);
  orderService: OrderService = inject(OrderService);
  router: Router = inject(Router);
  selected: string = 'orders';
  hide: boolean = false;
  orders!: number;

  hideLabels() {
    this.hide = !this.hide;
  }

  navigate(target: string) {
    this.selected = target;
    switch (target) {
      case 'orders':
        this.router.navigate(['administration']);
        break;
      case 'categories':
        this.router.navigate(['administration', 'categories']);
        break;
      case 'products':
        this.router.navigate(['administration', 'products']);
        break;
      case 'coupons':
        this.router.navigate(['administration', 'coupons']);
        break;

      case 'settings':
        this.router.navigate(['administration', 'settings']);
        break;
      case 'logout':
        this.adminService.logout();
        break;
      case '':
        this.router.navigate(['']);
        break;
    }
  }

  ngOnInit() {
    this.orderService.processing.subscribe((value: number) => {
      this.orders = value;
    });
    let url = this.router.url;
    if (url.includes('categories')) {
      this.selected = 'categories';
    } else if (url.includes('products')) {
      this.selected = 'products';
    } else if (url.includes('coupons')) {
      this.selected = 'coupons';
    } else if (url.includes('settings')) {
      this.selected = 'settings';
    } else {
      this.selected = 'orders';
    }
  }
}
