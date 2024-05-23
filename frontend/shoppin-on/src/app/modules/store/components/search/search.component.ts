import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../interfaces/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  prodcutService: ProductService = inject(ProductService);
  search: string = '';
  loading: boolean = false;
  products: Array<Product> = [];
  selected: Product | null = null;
  onCLose() {
    this.selected = null;
  }

  selectProduct(product: Product) {
    this.selected = product;
  }

  @ViewChild('item') item!: ElementRef;

  @HostListener('document:click', ['$event']) handleClickOutside(
    event: MouseEvent
  ) {
    if (this.search !== '' && !this.item.nativeElement.contains(event.target)) {
      this.search = '';
    }
  }

  onChange(value: any) {
    this.loading = true;
    this.prodcutService.getProducts('?limit=5&page=1&name=' + value).subscribe({
      next: (response: any) => {
        this.products = response.data.products;
        this.loading = false;
      },
      error: (_) => {
        this.products = [];
        this.loading = false;
      },
    });
  }
}
