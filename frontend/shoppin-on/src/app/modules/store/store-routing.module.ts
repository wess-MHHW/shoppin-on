import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { HotOffersComponent } from './components/hot-offers/hot-offers.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DefaultComponent } from './components/default/default.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { loginGuard } from '../../utils/route-guards/login.guard';
import { StoreProductsComponent } from './components/store-products/store-products.component';
import { AdminCategoryResolve } from '../../utils/route-guards/admin-category-resolve.guard';
import { AdminProductResolve } from '../../utils/route-guards/admin-product-resolve.guard';
import { HotOffersResolve } from '../../utils/route-guards/hot-offers-resolve.guard';
import { BestSellersResolve } from '../../utils/route-guards/best-sellers-resolve.guard';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    resolve: {
      categories: AdminCategoryResolve,
    },
    children: [
      {
        path: '',
        component: HomeComponent,
        resolve: {
          categories: AdminCategoryResolve,
          products: AdminProductResolve,
        },
      },
      {
        path: 'products',
        component: StoreProductsComponent,
        resolve: {
          products: AdminProductResolve,
          categories: AdminCategoryResolve,
        },
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        resolve: {
          data: AdminCategoryResolve,
        },
      },
      {
        path: 'best-sellers',
        component: BestSellersComponent,
        resolve: {
          products: BestSellersResolve,
        },
      },
      {
        path: 'hot-offers',
        component: HotOffersComponent,
        resolve: {
          products: HotOffersResolve,
        },
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard],
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
