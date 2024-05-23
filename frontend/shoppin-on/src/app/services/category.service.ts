import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http: HttpClient = inject(HttpClient);

  createCategory(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/category/create', data);
  }

  getCategories(): Observable<any> {
    return this.http.get('http://localhost:3000/category/get-all');
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.patch('http://localhost:3000/category/update/' + id, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete('http://localhost:3000/category/delete/' + id);
  }
}
