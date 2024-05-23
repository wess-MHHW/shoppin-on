import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Administrator } from '../interfaces/administrator';
import { HttpClient } from '@angular/common/http';
import { getLsItem } from '../utils/functions/get-local-storage';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  router: Router = inject(Router);
  user: BehaviorSubject<Administrator | null> =
    new BehaviorSubject<Administrator | null>(null);
  http: HttpClient = inject(HttpClient);
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      'http://localhost:3000/user/login',
      {
        username,
        password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['', 'login']);
    localStorage.removeItem('customer');
  }

  autoLogout(token: any) {
    const decoded: JwtPayload = jwtDecode(token);

    let timeout = setTimeout(() => {
      this.logout();
      clearTimeout(timeout);
    }, (decoded.exp! - decoded.iat!) * 1000);
  }

  autoLogin() {
    let administrator: Administrator | null =
      getLsItem<Administrator>('customer');

    if (administrator) {
      let decoded: JwtPayload = jwtDecode(administrator.token);
      if ((decoded.exp! - decoded.iat!) * 1000) {
        this.user.next(administrator);
        this.autoLogout(administrator.token);
      }
    }
  }

  updateUser(id: string, data: any) {
    return this.http.post('http://localhost:3000/user/update/' + id, data);
  }
}
