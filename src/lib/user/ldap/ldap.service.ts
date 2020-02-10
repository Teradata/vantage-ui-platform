import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mixinHttp, TdGET, TdPOST, TdPATCH, TdDELETE, TdParam, TdBody, TdResponse } from '@covalent/http';

export enum LDAPEncription {
  None = 'NONE',
}

export interface ILDAPConfig {
  allowed_groups?: string[];
  base_dn?: string;
  config_id?: number;
  connectionUrl?: string;
  email_field?: string;
  encryption?: LDAPEncription;
  group_id_field?: string;
  groups_base_dn?: string;
  id_field?: string;
  member_field?: string;
  member_of_field?: string;
  name_field?: string;
  port?: number;
  search_pass?: string;
  search_user?: string;
  server?: string;
  url?: string;
}

@Injectable()
export class VantageLDAPService extends mixinHttp(class {}, {
  baseUrl: '/api/user/ldap/config',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
}) {
  @TdGET({
    path: '/',
  })
  query(@TdResponse() response?: Observable<ILDAPConfig[]>): Observable<ILDAPConfig[]> {
    return response;
  }

  @TdPOST({
    path: '/',
  })
  create(@TdBody() body: ILDAPConfig, @TdResponse() response?: Observable<ILDAPConfig>): Observable<ILDAPConfig> {
    return response;
  }

  @TdPATCH({
    path: '/:id',
  })
  update(
    @TdParam('id') id: string | number,
    @TdBody() body: ILDAPConfig,
    @TdResponse() response?: Observable<ILDAPConfig>,
  ): Observable<ILDAPConfig> {
    return response;
  }

  @TdDELETE({
    path: '/:id',
  })
  delete(@TdParam('id') id: string | number, @TdResponse() response?: Observable<void>): Observable<void> {
    return response;
  }

  @TdPOST({
    path: '/verify',
    options: {
      observe: 'response',
    },
  })
  test(@TdBody() body: ILDAPConfig, @TdResponse() response?: Observable<boolean>): Observable<boolean> {
    return response.pipe(
      map((res: any) => {
        return res.status === 200;
      }),
    );
  }
}

export function VANTAGE_LDAP_PROVIDER_FACTORY(parent: VantageLDAPService): VantageLDAPService {
  return parent || new VantageLDAPService();
}

export const VANTAGE_LDAP_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageLDAPService,
  deps: [[new Optional(), new SkipSelf(), VantageLDAPService]],
  useFactory: VANTAGE_LDAP_PROVIDER_FACTORY,
};
