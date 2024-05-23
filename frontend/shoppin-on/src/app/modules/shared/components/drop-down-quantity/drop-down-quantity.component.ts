import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-drop-down-quantity',
  templateUrl: './drop-down-quantity.component.html',
  styleUrl: './drop-down-quantity.component.css',
})
export class DropDownQuantityComponent {
  @Input() quantity!: number;
  @Input() selected!: number | null;
  @ViewChild('dropdownContainer')
  dropdownContainer!: ElementRef;
  @Output() selectedChange: EventEmitter<number> = new EventEmitter<number>();
  show: boolean = false;
  options: Array<number> = [];

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.show &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.show = false;
    }
  }

  display(option?: number) {
    if (option) {
      this.selected = option;
      this.selectedChange.emit(option);
    }
    this.show = !this.show;
  }

  ngOnInit() {
    this.options = Array.from({ length: this.quantity }, (_, i) => i + 1);
  }
}
