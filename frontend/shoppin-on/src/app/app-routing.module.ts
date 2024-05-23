import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from './modules/store/store.module';
import { DefaultComponent } from './modules/store/components/default/default.component';
import { NotFoundComponent } from './modules/not-found/components/not-found/not-found.component';
import { NotFoundModule } from './modules/not-found/not-found.module';
import { MainComponent } from './modules/dashboard/components/main/main.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { administrationGuard } from './utils/route-guards/administration.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
  },
  {
    path: 'administration',
    component: MainComponent,
    canActivate: [administrationGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    DashboardModule,
    StoreModule,
    NotFoundModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
