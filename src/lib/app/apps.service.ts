/*
 * Copyright (C) 2016-2017 by Teradata Corporation. All rights reserved.
 * TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET
 */
import { Optional, SkipSelf, Provider, Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TdHttp, TdGET, TdPOST, TdDELETE, TdPATCH, TdParam, TdBody, TdResponse, TdQueryParams } from '@covalent/http';

export enum AppType {
  SQL = 'sql',
  BTEQ = 'bteq',
  JAVA = 'java',
  CUSTOM = 'custom',
}

export interface IApp {
  app_id?: string;
  app_type?: AppType;
  app_code?: string;
  collaborators?: IAppPermissions;
  color?: string;
  config?: any;
  cpus?: number;
  description?: string;
  dockerImageName?: string;
  icon?: string;
  install_time?: string;
  installed_by?: string;
  last_updated_by?: string;
  last_updated_time?: string;
  memory?: number;
  name?: string;
  owners?: IAppPermissions;
  public?: boolean;
  results_config?: any;
  versions?: any;
  last_version_status?: string;
  database?: string;
  system_name?: string;
  username?: string;
  password?: string;
  param_name?: string;
  ephemeral?: boolean;
  can_execute?: boolean;
  web_root?: string;
  access_url?: string;
  tag_names?: any[];
  exposedPorts?: any[];
  system_id?: string;
  containerPort?: number;
}

export interface IAppConfiguration {
  id: string;
  name?: string;
  type?: 'text' | 'number' | 'boolean' | 'date';
  min?: number | Date;
  max?: number | Date;
  required?: boolean;
  default?: any;
}

export interface IAppPermissions {
  users?: string[];
  groups?: string[];
}

@TdHttp({
  baseUrl: '/api/app',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
})
@Injectable()
export class VantageAppsService {
  @TdGET({
    path: '/apps',
    options: {
      observe: 'response',
    },
  })
  query(
    @TdQueryParams() params?: HttpParams,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<{ total: number; data: IApp[] }> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <IApp[]>res.body,
        };
      }),
    );
  }

  @TdGET({
    path: '/apps/:id',
  })
  get(@TdParam('id') id: string, @TdResponse() response?: Observable<IApp>): Observable<IApp> {
    return response;
  }

  @TdPOST({
    path: '/apps',
  })
  create(@TdBody() body: IApp, @TdResponse() response?: Observable<IApp>): Observable<IApp> {
    return response;
  }

  @TdPATCH({
    path: '/apps/:id',
  })
  update(@TdParam('id') id: string, @TdBody() body: IApp, @TdResponse() response?: Observable<IApp>): Observable<IApp> {
    return response;
  }

  @TdDELETE({
    path: '/apps/:id',
  })
  delete(@TdParam('id') id: string, @TdResponse() response?: Observable<IApp>): Observable<IApp> {
    return response;
  }

  @TdPOST({
    path: '/apps/:id/container',
  })
  public uploadFile(
    @TdParam('id') id: string,
    @TdBody() formData: FormData,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<boolean> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return true;
      }),
    );
  }
}

export function VANTAGE_APPS_PROVIDER_FACTORY(parent: VantageAppsService): VantageAppsService {
  return parent || new VantageAppsService();
}

export const VANTAGE_APPS_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageAppsService,
  deps: [[new Optional(), new SkipSelf(), VantageAppsService]],
  useFactory: VANTAGE_APPS_PROVIDER_FACTORY,
};
