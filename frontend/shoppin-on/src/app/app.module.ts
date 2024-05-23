import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminService } from './services/admin.service';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { StoreModule } from './modules/store/store.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { authorizationInterceptor } from './interceptors/authorization/authorization.interceptor';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { CouponService } from './services/coupon.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SavedService } from './services/saved.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule,
  ],
  providers: [
    AdminService,
    CategoryService,
    ProductService,
    CouponService,
    SavedService,
    CartService,
    OrderService,
    provideAnimations(),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
