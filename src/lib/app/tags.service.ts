/*
 * Copyright (C) 2016-2017 by Teradata Corporation. All rights reserved.
 * TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET
 */
import { Optional, SkipSelf, Provider, Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { TdHttp, TdQueryParams, TdResponse, TdGET } from '@covalent/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ITag {
  tag_id?: string;
  tag?: string;
}

@TdHttp({
  baseUrl: '/api/app',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
})
@Injectable()
export class VantageTagsService {
  @TdGET({
    path: '/tags',
    options: {
      observe: 'response',
    },
  })
  query(
    @TdQueryParams() params?: HttpParams,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<{ total: number; data: ITag[] }> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <ITag[]>res.body,
        };
      }),
    );
  }
}

export function VANTAGE_TAGS_PROVIDER_FACTORY(parent: VantageTagsService): VantageTagsService {
  return parent || new VantageTagsService();
}

export const VANTAGE_TAGS_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageTagsService,
  deps: [[new Optional(), new SkipSelf(), VantageTagsService]],
  useFactory: VANTAGE_TAGS_PROVIDER_FACTORY,
};
