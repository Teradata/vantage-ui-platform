import { Optional, SkipSelf, Provider } from '@angular/core';
import { HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  TdHttp,
  TdGET,
  TdPUT,
  TdPOST,
  TdDELETE,
  TdParam,
  TdBody,
  TdResponse,
  TdQueryParams,
} from '@covalent/http';

export enum SystemType {
  Teradata = 'TERADATA',
  Aster = 'ASTER',
  Presto = 'PRESTO',
}

export const VANTAGE_SYSTEMS_TYPES: SystemType[] = [
  SystemType.Teradata,
  SystemType.Aster,
  SystemType.Presto,
];

export interface ISystemAttributes {
  attributes?: any;
}

export interface IAbstractSystem {
  host?: string;
  port?: number;
  system_type?: SystemType;
  catalog?: string;
  schema?: string;
}

export interface ISystem extends IAbstractSystem {
  attributes?: string;
  data_center?: string;
  environment?: string;
  id?: string;
  nickname?: string;
  platform_id?: number;
  system_attributes?: ISystemAttributes;
  version?: string;
}

export interface ITestSystem extends IAbstractSystem {
  account?: string;
  default_char_set?: string;
  default_database?: string;
  log_mech?: string;
  password?: string;
  username?: string;
}

@TdHttp({
  baseUrl: '/api/system',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json' }),
})
export class VantageSystemService {

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

  @TdGET({
    path: '/systems',
    options: {
      observe: 'response',
    },
  })
  query(@TdQueryParams() params?: HttpParams,
         @TdResponse() response?: Observable<HttpResponse<any>>): Observable<{total: number, data: ISystem[]}> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <ISystem[]>res.body,
        };
      }),
    );
  }

  @TdGET({
    path: '/systems/:id',
  })
  get(@TdParam('id') id: string | number,
        @TdResponse() response?: Observable<ISystem>): Observable<ISystem> {
    return response;
  }

  @TdPOST({
    path: '/systems',
  })
  create(@TdBody() system: ISystem,
          @TdResponse() response?: Observable<ISystem>): Observable<ISystem> {
    return response;
  }

  @TdPUT({
    path: '/systems/:id',
  })
  update(@TdParam('id') id: string,
          @TdBody() system: ISystem,
          @TdResponse() response?: Observable<ISystem>): Observable<ISystem> {
    return response;
  }

  @TdDELETE({
    path: '/systems/:id',
  })
  delete(@TdParam('id') id: string,
          @TdResponse() response?: Observable<void>): Observable<void> {
    return response;
  }

  @TdPOST({
    path: '/testsystem',
  })
  test(@TdBody() system: ITestSystem,
        @TdResponse() response?: Observable<HttpResponse<any>>): Observable<boolean> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return true;
      }),
    );
  }
}

export function VANTAGE_SYSTEM_PROVIDER_FACTORY(parent: VantageSystemService): VantageSystemService {
  return parent || new VantageSystemService();
}

export const VANTAGE_SYSTEM_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageSystemService,
  deps: [[new Optional(), new SkipSelf(), VantageSystemService]],
  useFactory: VANTAGE_SYSTEM_PROVIDER_FACTORY,
};
