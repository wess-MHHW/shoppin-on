import { Component, OnInit, inject } from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories-admin',
  templateUrl: './categories-admin.component.html',
  styleUrl: './categories-admin.component.css',
})
export class CategoriesAdminComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  categoryService: CategoryService = inject(CategoryService);

  categories: Array<Category> = [];
  category: Category | null = null;
  message: string = '';
  role: string = '';
  loading: boolean = false;
  show: boolean = false;

  openDilaog(role: string, category: Category | null) {
    this.show = true;
    this.role = role;
    this.category = category;
  }

  deleteCategory(element: any) {
    this.loading = true;
    let index = this.categories.findIndex(
      (item: any) => item._id === element._id
    );

    this.categoryService.deleteCategory(element._id).subscribe({
      next: (response: any) => {
        this.categories.splice(index, 1);
        this.loading = false;
      },
      error: (error: any) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  onEdit(item: FormData) {
    this.loading = true;
    let index = this.categories.findIndex(
      (item: any) => item._id === this.category!._id
    );
    this.categoryService.updateCategory(this.category!._id, item).subscribe({
      next: (data: any) => {
        this.categories[index] = data.data.category;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  onCreate(item: FormData) {
    this.loading = true;

    this.categoryService.createCategory(item).subscribe({
      next: (data: any) => {
        this.categories.unshift(data.data.category);
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 0) {
          this.message = 'Sorry, the server is busy. Please try again later';
        } else {
          this.message = error.error.message;
        }

        let timeout = setTimeout((): void => {
          this.message = '';
          clearTimeout(timeout);
        }, 5000);
        this.loading = false;
      },
    });
  }

  onClose(value: boolean) {
    this.show = false;
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.data.error) {
          if (response.data.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.data.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.categories = response.data.data.categories;
        }
      },
    });
  }
}
