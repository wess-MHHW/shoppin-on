import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-special-dialog',
  templateUrl: './special-dialog.component.html',
  styleUrl: './special-dialog.component.css',
})
export class SpecialDialogComponent {
  @Input() product!: any | null;
  @Input() role!: string;
  submit: boolean = false;
  @Input() selected!: Category;
  deleted: Array<Number> = [];

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() create: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Output() edit: EventEmitter<FormData> = new EventEmitter<FormData>();

  files: Array<File> = [];

  closeDialog() {
    this.close.emit(false);
  }

  onclick(number: Number) {
    let index = this.deleted.findIndex((item) => item === number);
    if (index !== -1) {
      this.deleted.splice(index, 1);
    } else {
      this.deleted.push(number);
    }
  }

  onFile(event: any) {
    if (event.target.value) {
      Array.from(event.target.files).forEach((element: any) => {
        this.files.push(element);
      });
    }
  }

  submitForm(form: NgForm) {
    this.submit = true;
    if (form.valid) {
      let fd = new FormData();
      if (this.files.length !== 0) {
        this.files.forEach((file) => {
          fd.append('files', file, file.name);
        });
      }

      fd.append('name', form.value.name);
      fd.append('description', form.value.descirption);
      fd.append('qunaity', form.value.quantity);
      fd.append('unitPrice', form.value.unitPrice);
      fd.append('price', form.value.price);
      fd.append('discount', form.value.discount);
      fd.append('category', form.value.category);

      this.close.emit(false);

      if (this.role.toLowerCase().includes('create')) {
        this.create.emit(fd);
      } else {
        let images = this.product.photos.filter(
          (item: any, index: number) => !this.deleted.includes(index)
        );

        fd.append('photos', JSON.stringify(images));

        this.edit.emit(fd);
      }
    }
  }

  onChange(event: any, form: NgForm) {
    form.controls['category'].setValue(event._id === '' ? '' : event._id);
  }
}
