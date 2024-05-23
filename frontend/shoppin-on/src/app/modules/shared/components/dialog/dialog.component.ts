import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  submit = false;
  @Input() role!: string;
  @Input() category!: Category | null;
  file: File | null = null;
  categoryService: CategoryService = inject(CategoryService);
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() create: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Output() edit: EventEmitter<FormData> = new EventEmitter<FormData>();

  onFile(event: any) {
    if (event.target.value) {
      this.file = event.target.files[0];
    }
  }

  closeDialog() {
    this.close.emit(false);
  }

  submitForm(form: NgForm) {
    this.submit = true;
    if (form.valid) {
      let fd = new FormData();
      if (this.file) {
        fd.append('file', this.file!, this.file?.name);
      }
      fd.append('name', form.value.name);
      this.close.emit(false);
      if (this.role.toLowerCase().includes('create')) {
        this.create.emit(fd);
      } else {
        this.edit.emit(fd);
      }
    }
  }
}
