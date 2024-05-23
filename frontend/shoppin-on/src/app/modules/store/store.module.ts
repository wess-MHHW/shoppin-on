import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HotOffersComponent } from './components/hot-offers/hot-offers.component';
import { OrdersComponent } from './components/orders/orders.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { LoginComponent } from './components/login/login.component';
import { DefaultComponent } from './components/default/default.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

import { FormsModule } from '@angular/forms';
import { StoreProductsComponent } from './components/store-products/store-products.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { FilterComponent } from './components/filter/filter.component';
import { BrowserModule } from '@angular/platform-browser';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { OrderComponent } from './components/order/order.component';

@NgModule({
  declarations: [
    HomeComponent,
    CategoriesComponent,
    HotOffersComponent,
    OrdersComponent,
    BestSellersComponent,
    LoginComponent,
    DefaultComponent,
    HeaderComponent,
    SearchComponent,
    FavoritesComponent,
    StoreProductsComponent,
    FooterComponent,
    ProductComponent,
    FilterComponent,
    ProductDetailsComponent,
    OrderComponent,
  ],
  imports: [CommonModule, SharedModule, StoreRoutingModule, FormsModule],
  exports: [DefaultComponent],
})
export class StoreModule {}
