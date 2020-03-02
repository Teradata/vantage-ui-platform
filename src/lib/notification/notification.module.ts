import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_SMTP_PROVIDER } from './smtp/smtp.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_SMTP_PROVIDER],
})
export class VantageNotificationModule {}
