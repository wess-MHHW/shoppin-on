import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsValidator } from '../../../../utils/validators/passwords-validator';
import { Administrator } from '../../../../interfaces/administrator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  adminService: AdminService = inject(AdminService);
  types: Array<string> = ['password', 'password', 'password'];
  loading: boolean = false;
  changeImage: boolean = false;
  submit: boolean = false;
  message: string = '';
  image: string = '';
  current: string = '';
  form!: FormGroup;
  file: File | null = null;
  admin!: Administrator | null;
  data: any;

  onClick(index: number) {
    this.types[index] = this.types[index] === 'text' ? 'password' : 'text';
  }

  fileChange(event: any) {
    this.changeImage = true;

    // Store the selected file object
    this.file = event.target.files[0];

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      // Set the image source using the result
      this.image = e.target.result;
    };

    // Read the file content as data URL
    reader.readAsDataURL(this.file!);
  }

  cancelChangeImage() {
    this.changeImage = false;
    this.image = this.current;
    this.file = null;
  }

  saveImage() {
    let fd = new FormData();
    if (this.file) {
      this.loading = true;
      fd.append('file', this.file!, this.file?.name);
      this.adminService.updateUser(this.admin!._id, fd).subscribe({
        next: (response: any) => {
          this.admin!.photo = response.data.user.photo;
          this.image = 'http://localhost:3000/' + this.admin!.photo;
          this.current = this.image;
          this.loading = false;
          this.file = null;
          this.changeImage = false;
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
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.loading = true;
      let fd = new FormData();
      fd.append('password', this.form.get('current')?.value);
      fd.append('newPassword', this.form.get('confirm.new')?.value);

      this.adminService.updateUser(this.admin!._id, fd).subscribe({
        next: (_) => {
          this.submit = false;
          this.form.reset();
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
  }

  reset() {
    this.submit = false;
    this.form.reset();
  }

  ngOnInit() {
    this.form = new FormGroup({
      confirm: new FormGroup(
        {
          new: new FormControl('', [Validators.required]),
          copy: new FormControl('', [Validators.required]),
        },
        passwordsValidator
      ),
      current: new FormControl('', [Validators.required]),
    });

    this.adminService.user.subscribe((user: Administrator | null) => {
      this.admin = user;
      this.image = 'http://localhost:3000/' + this.admin!.photo;
      this.current = this.image;
    });
  }
}
