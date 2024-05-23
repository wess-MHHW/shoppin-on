import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product';
import { getLsItem } from '../utils/functions/get-local-storage';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart!: BehaviorSubject<Array<{ product: Product; quantity: number }>>;

  constructor() {
    let cart: Array<{ product: Product; quantity: number }> =
      getLsItem('cart') ?? [];
    this.cart = new BehaviorSubject<
      Array<{ product: Product; quantity: number }>
    >(cart);
  }
}
