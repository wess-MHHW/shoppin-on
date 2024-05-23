import { Component, inject } from '@angular/core';
import { Product } from '../../../../interfaces/product';
import { getLsItem } from '../../../../utils/functions/get-local-storage';
import { SavedService } from '../../../../services/saved.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  savedService: SavedService = inject(SavedService);
  products: Array<Product> = [];
  selected: Product | null = null;
  onCLose() {
    this.selected = null;
  }

  selectProduct(product: Product) {
    this.selected = product;
  }
  ngOnInit() {
    this.savedService.saved.subscribe((value) => {
      this.products = getLsItem('favorites') ?? [];
    });
  }

  clearAll() {
    localStorage.removeItem('favorites');
    this.products = [];
  }
}
