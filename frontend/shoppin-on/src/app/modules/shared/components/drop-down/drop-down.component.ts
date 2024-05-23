import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
})
export class DropDownComponent {
  service: CategoryService = inject(CategoryService);
  options!: Array<Category> | undefined;
  @Input() selected!: Category | undefined;
  @ViewChild('dropdownContainer')
  dropdownContainer!: ElementRef;
  @Output() selectedChange: EventEmitter<Category | undefined> =
    new EventEmitter<Category | undefined>();

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.show &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.show = false;
    }
  }
  show: boolean = false;
  display(category?: Category) {
    if (category) {
      this.selected = category;
      this.selectedChange.emit(category);
    }
    this.show = !this.show;
  }

  ngOnInit() {
    this.service.getCategories().subscribe((data: any) => {
      this.options = data.data.categories;
      this.options?.unshift({
        _id: '',
        name: 'None',
        photo: '',
      });
    });
  }
}
