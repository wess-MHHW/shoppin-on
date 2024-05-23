import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getLsItem } from '../utils/functions/get-local-storage';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class SavedService {
  saved!: BehaviorSubject<number>;

  constructor() {
    let favorites: Array<Product> = getLsItem('favorites') ?? [];
    this.saved = new BehaviorSubject<number>(favorites.length);
  }
}
