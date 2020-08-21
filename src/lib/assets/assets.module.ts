import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VantageAssetsService } from './assets.service';

@NgModule({
  imports: [CommonModule],
  providers: [VantageAssetsService],
})
export class VantageAssetsModule {}
