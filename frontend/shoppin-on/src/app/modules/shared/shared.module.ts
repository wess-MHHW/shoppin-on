import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { DialogComponent } from './components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { SpecialDialogComponent } from './components/special-dialog/special-dialog.component';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { DropDownQuantityComponent } from './components/drop-down-quantity/drop-down-quantity.component';

@NgModule({
  declarations: [
    DialogComponent,
    LoadingIndicatorComponent,
    SpecialDialogComponent,
    DropDownComponent,
    SnackbarComponent,
    DropDownQuantityComponent,
  ],
  imports: [CommonModule, SharedRoutingModule, FormsModule],
  exports: [
    DialogComponent,
    LoadingIndicatorComponent,
    SpecialDialogComponent,
    DropDownComponent,
    SnackbarComponent,
    DropDownQuantityComponent,
  ],
})
export class SharedModule {}
