import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_APPS_PROVIDER } from './apps.service';
import { VANTAGE_TAGS_PROVIDER } from './tags.service';
import { VantageAppIconComponent } from './app-icon/app-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [VantageAppIconComponent],
  imports: [CommonModule, MatIconModule, MatListModule],
  providers: [VANTAGE_APPS_PROVIDER, VANTAGE_TAGS_PROVIDER],
  exports: [VantageAppIconComponent],
})
export class VantageAppModule {}
