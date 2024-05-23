import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http: HttpClient = inject(HttpClient);
  processing: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  createOrder(data: any) {
    return this.http.post('http://localhost:3000/order/create', data);
  }

  getOrders(phone: string) {
    return this.http.get('http://localhost:3000/order/get-all/' + phone);
  }

  cancelOrder(id: string) {
    return this.http.post('http://localhost:3000/order/cancel/' + id, {});
  }

  getAllOrders(query: string) {
    return this.http.get('http://localhost:3000/order/filter/' + query);
  }

  getStats() {
    return this.http.get('http://localhost:3000/order/get-stats');
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.patch('http://localhost:3000/order/update/' + id, {
      status,
    });
  }
}
