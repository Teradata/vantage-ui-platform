import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CovalentMenuModule } from '@covalent/core/menu';

import { TranslateModule } from '@ngx-translate/core';

import { VantageThemeModule } from '../theme/theme.module';

import { VantageAppSwitcherComponent } from './app-switcher.component';

@NgModule({
  declarations: [VantageAppSwitcherComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,

    /* covalent modules */
    CovalentMenuModule,

    /* third party deps */
    TranslateModule.forChild(),

    /* vantage modules */
    VantageThemeModule,
  ],
  providers: [],
  exports: [VantageAppSwitcherComponent],
})
export class VantageAppSwitcherModule {}
