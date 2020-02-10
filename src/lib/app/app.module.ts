import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_APP_PROVIDER } from './app.service';
import { VANTAGE_TAGS_PROVIDER } from './tags.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_APP_PROVIDER, VANTAGE_TAGS_PROVIDER],
})
export class VantageAppModule {}
