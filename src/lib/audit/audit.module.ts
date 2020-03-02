import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_AUDIT_PROVIDER } from './audit.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_AUDIT_PROVIDER],
})
export class VantageAuditModule {}
