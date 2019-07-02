import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_TOKEN_PROVIDER } from './token/token.service';
import { VANTAGE_SESSION_PROVIDER } from './session/session.service';

import { VantageAuthenticationGuard } from './guards/authentication.guard';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    VANTAGE_TOKEN_PROVIDER,
    VANTAGE_SESSION_PROVIDER,
    VantageAuthenticationGuard,
  ],
})
export class VantageAuthenticationModule {

}
