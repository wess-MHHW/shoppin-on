import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Product } from '../../../../interfaces/product';
import { setLsItem } from '../../../../utils/functions/set-local-storage';
import { getLsItem } from '../../../../utils/functions/get-local-storage';
import { SavedService } from '../../../../services/saved.service';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  savedService: SavedService = inject(SavedService);
  cartService: CartService = inject(CartService);
  @Input() product!: Product | null;
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  index: number = 0;
  quantity: number = 1;
  saved!: boolean;

  saveProduct() {
    let favorites: Array<Product> = getLsItem('favorites') ?? [];
    if (this.saved) {
      this.saved = false;
      favorites = favorites.filter(
        (item: Product) => item._id !== this.product!._id
      );
    } else {
      this.saved = true;
      favorites.unshift(this.product!);
    }
    setLsItem('favorites', favorites);
    this.savedService.saved.next(favorites.length);
  }

  onClose() {
    this.close.emit(false);
  }

  selectPhoto(value: number) {
    this.index = value;
  }

  ngOnInit() {
    let favorites: Array<Product> = getLsItem('favorites') ?? [];
    this.saved =
      favorites.findIndex((item) => item._id === this.product!._id) !== -1;
  }

  addTocart() {
    console.log(this.product);
    console.log(this.quantity);
    let cart: Array<{ product: Product; quantity: number }> =
      getLsItem('cart') ?? [];
    cart = cart.filter(
      (item: { product: Product; quantity: number }) =>
        item.product._id !== this.product!._id
    );
    cart.unshift({ product: this.product!, quantity: this.quantity });
    setLsItem('cart', cart);
    this.cartService.cart.next(cart);
    this.close.emit(false);
  }
}
