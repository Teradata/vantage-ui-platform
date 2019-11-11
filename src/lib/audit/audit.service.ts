import { Optional, SkipSelf, Provider } from '@angular/core';
import { HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TdHttp, TdGET, TdPOST, TdParam, TdBody, TdResponse, TdQueryParams } from '@covalent/http';

export interface IAuditLog {
  action?: string;
  component?: string;
  correlation_id?: string;
  details?: string;
  id?: number;
  logtime?: any;
  message?: string;
  result?: boolean;
  username?: string;
}

@TdHttp({
  baseUrl: '/api/audit',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
})
export class VantageAuditService {
  @TdGET({
    path: '/audit/messages',
    options: {
      observe: 'response',
    },
  })
  query(
    @TdQueryParams() params?: HttpParams,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<{ total: number; data: IAuditLog[] }> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <IAuditLog[]>res.body,
        };
      }),
    );
  }

  @TdPOST({
    path: '/audit/messages',
  })
  create(@TdBody() body: IAuditLog, @TdResponse() response?: Observable<IAuditLog>): Observable<IAuditLog> {
    return response;
  }

  @TdGET({
    path: '/audit/messages/:id',
  })
  get(@TdParam('id') id: number | string, @TdResponse() response?: Observable<IAuditLog>): Observable<IAuditLog> {
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

export function VANTAGE_AUDIT_PROVIDER_FACTORY(parent: VantageAuditService): VantageAuditService {
  return parent || new VantageAuditService();
}

export const VANTAGE_AUDIT_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageAuditService,
  deps: [[new Optional(), new SkipSelf(), VantageAuditService]],
  useFactory: VANTAGE_AUDIT_PROVIDER_FACTORY,
};
