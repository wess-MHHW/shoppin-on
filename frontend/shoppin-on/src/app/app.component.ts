import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'shoppin-on';
  adminService: AdminService = inject(AdminService);
  ngOnInit() {
    this.adminService.autoLogin();
  }
}
