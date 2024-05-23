import { AbstractControl } from '@angular/forms';

export function passwordsValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  if (control.get('new')?.value === control.get('copy')?.value) {
    return null;
  }
  return { missmatch: true };
}
