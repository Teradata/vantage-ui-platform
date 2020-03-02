import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_CONNECTION_PROVIDER } from './connection.service';
import { VANTAGE_DICTIONARY_PROVIDER } from './dictionary.service';
import { VANTAGE_QUERY_PROVIDER } from './query.service';

@NgModule({
  imports: [CommonModule],
  providers: [VANTAGE_CONNECTION_PROVIDER, VANTAGE_DICTIONARY_PROVIDER, VANTAGE_QUERY_PROVIDER],
})
export class VantageSQLEModule {}
