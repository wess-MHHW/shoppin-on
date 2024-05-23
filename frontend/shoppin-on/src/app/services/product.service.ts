import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http: HttpClient = inject(HttpClient);

  createProduct(data: any) {
    return this.http.post('http://localhost:3000/product/create', data);
  }

  getProducts(query: string) {
    return this.http.get('http://localhost:3000/product/filter' + query);
  }

  getBestSellersProducts() {
    return this.http.get('http://localhost:3000/product/get-best-sellers');
  }

  updateProduct(id: string, data: any) {
    return this.http.post('http://localhost:3000/product/update/' + id, data);
  }

  deleteProduct(id: string) {
    return this.http.delete('http://localhost:3000/product/delete/' + id);
  }
}
