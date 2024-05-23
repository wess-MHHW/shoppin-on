import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coupon } from '../../../../interfaces/coupon';
import { NgForm } from '@angular/forms';
import { CouponService } from '../../../../services/coupon.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css',
})
export class CouponsComponent implements OnInit {
  couponService: CouponService = inject(CouponService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  coupons: Array<Coupon> = [];
  selected: Coupon | null = null;
  message: string = '';
  submit: boolean = false;
  loading: boolean = false;
  show: boolean = false;

  showForm(value: Coupon | null): void {
    this.show = true;
    this.selected = value;
  }

  hideForm(): void {
    this.show = false;
  }

  deleteCoupon(coupon: Coupon) {
    this.loading = true;
    let index = this.coupons.findIndex((item: any) => item._id === coupon._id);
    this.couponService.deleteCoupon(coupon._id).subscribe({
      next: (_) => {
        this.coupons.splice(index, 1);
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

  setState(coupon: Coupon) {
    this.loading = true;
    this.couponService
      .updateCoupon(coupon._id, { active: !coupon.active })
      .subscribe({
        next: (_) => {
          this.coupons.find((item: any) => item._id === coupon._id)!.active =
            !coupon.active;
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

  onSubmit(form: NgForm) {
    this.submit = true;
    this.loading = true;
    if (form.valid) {
      this.show = false;
      this.submit = false;
      if (this.selected) {
        let index = this.coupons.findIndex(
          (item: any) => item._id === this.selected!._id
        );
        this.couponService
          .updateCoupon(this.selected._id, form.value)
          .subscribe({
            next: (response: any) => {
              this.coupons[index] = response.data.coupon;
              this.loading = false;
            },
            error: (error) => {
              if (error.status === 0) {
                this.message =
                  'Sorry, the server is busy. Please try again later';
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
      } else {
        this.couponService.createCoupon(form.value).subscribe({
          next: (response: any) => {
            this.coupons.unshift(response.data.coupon);
            this.loading = false;
          },
          error: (error) => {
            if (error.status === 0) {
              this.message =
                'Sorry, the server is busy. Please try again later';
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
    }
  }

  ngOnInit(): void {
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
          this.coupons = response.data.data.coupons;
        }
      },
    });
  }
}
