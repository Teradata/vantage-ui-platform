import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { CovalentMenuModule } from '@covalent/core/menu';

import { VantageAccountProfileMenuComponent } from './account-profile-menu/account-profile-menu.component';
import { VantageAccountProfileComponent } from './account-profile.component';

@NgModule({
  declarations: [VantageAccountProfileComponent, VantageAccountProfileMenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,

    /* covalent modules */
    CovalentMenuModule,
  ],
  providers: [],
  exports: [VantageAccountProfileComponent, VantageAccountProfileMenuComponent],
})
export class VantageAccountProfileModule {}
