import { Component, Input } from '@angular/core';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  @Input() categories: Array<Category> = [];
  year: number = new Date().getFullYear();
}
