import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentMessageModule } from '@covalent/core/message';

import { VantageSystemModule } from '@td-vantage/ui-platform/system';

import { TranslateModule } from '@ngx-translate/core';

import { VANTAGE_CONNECTION_PROVIDER } from './connection.service';
import { VANTAGE_DICTIONARY_PROVIDER } from './dictionary.service';
import { VANTAGE_QUERY_PROVIDER } from './query.service';
import { VANTAGE_SPOOLED_QUERY_PROVIDER } from './spooled-query.service';

import { VantageCredentialsDialogComponent } from './credentials-dialog/credentials-dialog.component';

@NgModule({
  declarations: [VantageCredentialsDialogComponent],
  exports: [VantageCredentialsDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    CovalentLoadingModule,
    CovalentMessageModule,
    VantageSystemModule,
    TranslateModule,
  ],
  providers: [
    VANTAGE_CONNECTION_PROVIDER,
    VANTAGE_DICTIONARY_PROVIDER,
    VANTAGE_QUERY_PROVIDER,
    VANTAGE_SPOOLED_QUERY_PROVIDER,
  ],
})
export class VantageSQLEModule {}
