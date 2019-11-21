import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_APPS_PROVIDER } from './apps.service';
import { VANTAGE_TAGS_PROVIDER } from './tags.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_APPS_PROVIDER, VANTAGE_TAGS_PROVIDER],
})
export class VantageAppModule {}
