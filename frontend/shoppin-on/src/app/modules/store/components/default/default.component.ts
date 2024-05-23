import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrl: './default.component.css',
})
export class DefaultComponent {
  scrollY: number = 0;
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  message: string = '';
  categories: Array<Category> = [];
  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (response: any) => {
        if (response.categories.error) {
          if (response.categories.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later';
          } else {
            this.message = response.categories.error.message;
          }
          let timeout = setTimeout((): void => {
            this.message = '';
            clearTimeout(timeout);
          }, 5000);
        } else {
          this.categories = response.categories.data.categories;
        }
      },
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.scrollY = window.scrollY;
  }
  scrollTop() {
    window.scroll({
      top: 0,
    });
  }
}
