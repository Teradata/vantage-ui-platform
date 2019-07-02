import { Provider, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  TdHttp,
  TdGET,
  TdPUT,
  TdDELETE,
  TdBody,
  TdResponse,
} from '@covalent/http';

export interface ISMTPConfig {
  server?: string;
  port?: number;
  reply_address?: string;
  smtp_username?: string;
  smtp_password?: string;
  use_ssl?: boolean;
  anon_logon?: boolean;
  server_timeout?: number;
}

@TdHttp({
  baseUrl: '/api/notification',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json' }),
})
export class VantageSMTPService {

  @TdPUT({
    path: '/smtp-config',
  })
  create(@TdBody() body: ISMTPConfig,
         @TdResponse() response?: Observable<ISMTPConfig>,
        ): Observable<ISMTPConfig> {
    return response;
  }

  @TdGET({
    path: '/smtp-config',
  })
  query(@TdResponse() response?: Observable<ISMTPConfig>): Observable<ISMTPConfig> {
    return response;
  }
  
  @TdDELETE({
    path: '/smtp-config',
  })
  delete(@TdResponse() response?: Observable<void>): Observable<void> {
    return response;
  }

  @TdGET({
    path: '/health',
  })
  health(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<boolean> {
    return response.pipe(
      catchError((error: HttpErrorResponse) => {
        return of(false);
      }),
      map((res: HttpResponse<any>) => {
        return !!res;
      }),
    );
  }
}

export function VANTAGE_SMTP_PROVIDER_FACTORY(parent: VantageSMTPService): VantageSMTPService {
  return parent || new VantageSMTPService();
}

export const VANTAGE_SMTP_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageSMTPService,
  deps: [[new Optional(), new SkipSelf(), VantageSMTPService]],
  useFactory: VANTAGE_SMTP_PROVIDER_FACTORY,
};
