import { VantageUserProfileComponent } from './user-profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentUserProfileModule } from '@covalent/core/user-profile';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [VantageUserProfileComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    CovalentCommonModule,
    CovalentUserProfileModule,
    TranslateModule.forRoot(),
  ],
  exports: [VantageUserProfileComponent],
})
export class VantageUserProfileModule {}
