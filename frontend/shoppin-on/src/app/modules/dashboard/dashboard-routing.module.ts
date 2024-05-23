import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { CategoriesAdminComponent } from './components/categories-admin/categories-admin.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { OrdersAdminComponent } from './components/orders-admin/orders-admin.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminCategoryResolve } from '../../utils/route-guards/admin-category-resolve.guard';
import { AdminProductResolve } from '../../utils/route-guards/admin-product-resolve.guard';
import { AdminCouponResolve } from '../../utils/route-guards/admin-coupon-resolve.guard';
import { AdminOrdersResolve } from '../../utils/route-guards/admin-orders-resolve.guard';
import { AdminMenuResolve } from '../../utils/route-guards/admin-menu-resolve.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OrdersAdminComponent,
        resolve: {
          orders: AdminOrdersResolve,
          stats: AdminMenuResolve,
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'categories',
        component: CategoriesAdminComponent,
        resolve: {
          data: AdminCategoryResolve,
        },
      },

      {
        path: 'coupons',
        component: CouponsComponent,
        resolve: {
          data: AdminCouponResolve,
        },
      },

      {
        path: 'products',
        component: ProductsComponent,
        resolve: {
          data: AdminProductResolve,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
