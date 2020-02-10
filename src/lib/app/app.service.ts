import { Optional, SkipSelf, Provider, Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import {
  mixinHttp,
  TdParam,
  TdBody,
  TdQueryParams,
  TdResponse,
  TdGET,
  TdPOST,
  TdDELETE,
  TdPATCH,
} from '@covalent/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum AppType {
  SQL = 'sql',
  BTEQ = 'bteq',
  CUSTOM = 'custom',
}

export interface IApp {
  app_id?: string;
  app_type?: AppType;
  app_code?: string;
  app_state?: string;
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
  favorite?: boolean;
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

@Injectable()
export class VantageAppService extends mixinHttp(class {}, {
  baseUrl: '/api/app',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
}) {
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

export function VANTAGE_APP_PROVIDER_FACTORY(parent: VantageAppService): VantageAppService {
  return parent || new VantageAppService();
}

export const VANTAGE_APP_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageAppService,
  deps: [[new Optional(), new SkipSelf(), VantageAppService]],
  useFactory: VANTAGE_APP_PROVIDER_FACTORY,
};
