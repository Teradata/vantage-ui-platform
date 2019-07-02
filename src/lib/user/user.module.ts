import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VANTAGE_LDAP_PROVIDER } from './ldap/ldap.service';
import { VANTAGE_USER_PROVIDER } from './user/user.service';
import { VANTAGE_GROUP_PROVIDER } from './group/group.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    VANTAGE_LDAP_PROVIDER,
    VANTAGE_USER_PROVIDER,
    VANTAGE_GROUP_PROVIDER,
  ],
})
export class VantageUserModule {

}
