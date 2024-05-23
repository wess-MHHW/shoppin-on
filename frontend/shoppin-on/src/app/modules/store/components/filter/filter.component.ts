import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  @Input() categories!: Array<Category>;
  @Input() id!: string;
  @Output() query: EventEmitter<string> = new EventEmitter<string>();
  arrow: Array<boolean> = [false, false, false, false];

  rotate(index: number) {
    this.arrow[index] = !this.arrow[index];
  }

  reset(form: NgForm) {
    form.reset();
    this.query.emit('?limit=10&page=');
  }

  onSubmit(form: NgForm) {
    let query = {
      category: form.value.category === '' ? null : form.value.category,
      discount:
        form.value.discount === '' || form.value.discount === null
          ? null
          : form.value.discount.includes('with'),
      min: form.value['price-min'] === '' ? null : form.value['price-min'],
      max: form.value['price-max'] === '' ? null : form.value['price-max'],
      filter:
        form.value.name && form.value.price
          ? '-name,-price'
          : form.value.name
          ? '-name'
          : form.value.price
          ? '-price'
          : null,
    };

    let filteredQuery: { [key: string]: any } = {};

    for (let [key, value] of Object.entries(query)) {
      if (value !== null) {
        filteredQuery[key] = value;
      }
    }

    let s: Array<string> = [];
    if (filteredQuery.hasOwnProperty('category')) {
      s.push('category=' + filteredQuery['category']);
    }

    if (filteredQuery.hasOwnProperty('discount')) {
      s.push('discount' + (filteredQuery['discount'] ? '[gt]=0' : '=0'));
    }

    if (filteredQuery.hasOwnProperty('filter')) {
      s.push('sort=' + filteredQuery['filter']);
    }

    if (filteredQuery.hasOwnProperty('min')) {
      s.push('price[gte]=' + filteredQuery['min']);
    }

    if (filteredQuery.hasOwnProperty('max')) {
      s.push('price[lte]=' + filteredQuery['max']);
    }

    this.query.emit('?' + s.join('&') + '&limit=10&page=');
  }
}
