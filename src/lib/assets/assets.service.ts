import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { mixinHttp, TdGET, TdResponse } from '@covalent/http';
import { Observable, of } from 'rxjs';

export interface IHelpAssets {
  [name: string]: {
    links: any[];
  };
}

export interface ILearnAssets {
  [name: string]: {
    links: any[];
  };
}

@Injectable()
export class VantageAssetsService extends mixinHttp(class {}, {
  baseUrl: '/vantage-assets',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
}) {
  /**
   * gets the help asset
   */
  @TdGET({
    path: '/json/help.json',
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

  /**
   * gets the help asset
   */
  @TdGET({
    path: '/json/learn.json',
    options: {
      observe: 'response',
    },
  })
  getLearnAsset(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<ILearnAssets> {
    return response.pipe(
      catchError((error: Response) => {
        return of(error);
      }),
      map((res: HttpResponse<ILearnAssets>) => {
        return res.body;
      }),
    );
  }
}
