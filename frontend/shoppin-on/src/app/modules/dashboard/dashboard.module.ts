import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { ProductsComponent } from './components/products/products.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MainComponent } from './components/main/main.component';
import { OrdersAdminComponent } from './components/orders-admin/orders-admin.component';
import { CategoriesAdminComponent } from './components/categories-admin/categories-admin.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MenuComponent,
    ProductsComponent,
    CouponsComponent,
    SettingsComponent,
    MainComponent,
    OrdersAdminComponent,
    CategoriesAdminComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
  ],
  exports: [MainComponent],
})
export class DashboardModule {}
