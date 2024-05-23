import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  http: HttpClient = inject(HttpClient);

  createCoupon(data: any) {
    return this.http.post('http://localhost:3000/coupon/create', data);
  }

  getCoupon(value: string) {
    return this.http.get('http://localhost:3000/coupon/get/' + value);
  }

  getCoupons() {
    return this.http.get('http://localhost:3000/coupon/get-all');
  }

  updateCoupon(id: string, data: any) {
    return this.http.patch('http://localhost:3000/coupon/update/' + id, data);
  }

  deleteCoupon(id: string) {
    return this.http.delete('http://localhost:3000/coupon/delete/' + id);
  }
}
