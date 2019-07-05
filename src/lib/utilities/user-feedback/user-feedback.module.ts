import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentMediaModule } from '@covalent/core/media';

import { VANTAGE_ERROR_PROVIDER } from './error/error.service';
import { VANTAGE_TOAST_PROVIDER } from './toast/toast.service';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    CovalentDialogsModule,
    CovalentMediaModule,
  ],
  providers: [
    VANTAGE_ERROR_PROVIDER,
    VANTAGE_TOAST_PROVIDER,
  ],
})
export class VantageUserFeedbackModule {

}
