import { map, catchError } from 'rxjs/operators';
import { Injectable, Optional, SkipSelf, Provider } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { mixinHttp, TdGET, TdResponse } from '@covalent/http';
import { Observable, of } from 'rxjs';

import { IMenuItem } from '@covalent/core/dynamic-menu';

export interface IHelpAssets {
  [name: string]: {
    links: IMenuItem[];
    learn?: IMenuItem[];
  };
}

@Injectable()
export class VantageAssetsService extends mixinHttp(class {}, {
  baseUrl: '/ui-assets',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
}) {
  /**
   * Retrieve the help JSON definition asset
   */
  @TdGET({
    path: '/json/help/help.json',
    options: {
      observe: 'response',
    },
  })
  getHelpJSON(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<IHelpAssets> {
    return response.pipe(
      catchError((error: Response) => {
        return of(error);
      }),
      map((res: HttpResponse<IHelpAssets>) => {
        return res.body;
      }),
    );
  }
}

export function VANTAGE_ASSETS_PROVIDER_FACTORY(parent: VantageAssetsService): VantageAssetsService {
  return parent || new VantageAssetsService();
}

export const VANTAGE_ASSETS_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageAssetsService,
  deps: [[new Optional(), new SkipSelf(), VantageAssetsService]],
  useFactory: VANTAGE_ASSETS_PROVIDER_FACTORY,
};
