import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VantageBlockRootAccessGuard } from './guards/block-root-access.guard';
import { VantageBlockUserAccessGuard } from './guards/block-user-access.guard';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    VantageBlockRootAccessGuard,
    VantageBlockUserAccessGuard,
  ],
})
export class VantageAccessModule {

}
