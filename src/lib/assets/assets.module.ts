import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VANTAGE_ASSETS_PROVIDER } from './assets.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_ASSETS_PROVIDER],
})
export class VantageAssetsModule {}
