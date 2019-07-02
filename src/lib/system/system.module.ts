import { NgModule, Type, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_SYSTEM_PROVIDER } from './system.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    VANTAGE_SYSTEM_PROVIDER,
  ],
})
export class VantageSystemModule {

}
