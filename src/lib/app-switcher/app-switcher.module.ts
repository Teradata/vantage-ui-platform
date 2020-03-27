import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CovalentMenuModule } from '@covalent/core/menu';

import { TranslateModule } from '@ngx-translate/core';

import { VantageThemeModule } from '@td-vantage/ui-platform/theme';

import { VantageAppSwitcherMenuComponent } from './app-switcher-menu/app-switcher-menu.component';
import { VantageAppSwitcherComponent } from './app-switcher.component';

@NgModule({
  declarations: [VantageAppSwitcherComponent, VantageAppSwitcherMenuComponent],
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
  exports: [VantageAppSwitcherComponent, VantageAppSwitcherMenuComponent],
})
export class VantageAppSwitcherModule {}
