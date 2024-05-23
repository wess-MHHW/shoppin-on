import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { Administrator } from '../../../../interfaces/administrator';
import { Router } from '@angular/router';
import { setLsItem } from '../../../../utils/functions/set-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router: Router = inject(Router);
  content: string = '';
  submit: boolean = false;
  type: string = 'text';
  hide: boolean = true;
  loading = false;
  service: AdminService = inject(AdminService);

  toggle() {
    this.type = this.type === 'text' ? 'password' : 'text';
  }

  onSubmit(form: NgForm) {
    this.submit = true;
    if (form.valid) {
      this.loading = true;
      this.service.login(form.value.username, form.value.password).subscribe({
        next: (response: any) => {
          let admin: Administrator = {
            token: response['token'],
            _id: response['data']['user']['_id'],
            email: response['data']['user']['email'],
            name: response['data']['user']['name'],
            phone: response['data']['user']['phone'],
            photo: response['data']['user']['photo'],
            username: response['data']['user']['username'],
          };
          this.service.user.next(admin);
          setLsItem('customer', admin);
          this.router.navigate(['administration']);
        },
        error: (error) => {
          if (error.status === 0) {
            this.content = 'Sorry, the server is busy. Please try again later';
          } else {
            this.content = error.error.message;
          }
          let timeout = setTimeout((): void => {
            this.content = '';
            clearTimeout(timeout);
          }, 5000);
          this.loading = false;
        },
      });
    }
  }
}
