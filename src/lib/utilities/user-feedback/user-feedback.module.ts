import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { VANTAGE_ERROR_PROVIDER } from './error/error.service';
import { VANTAGE_TOAST_PROVIDER } from './toast/toast.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    VANTAGE_ERROR_PROVIDER,
    VANTAGE_TOAST_PROVIDER,
  ],
})
export class VantageUserFeedbackModule {

}
