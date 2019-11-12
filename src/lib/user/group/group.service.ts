import { Provider, SkipSelf, Optional } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { TdHttp, TdGET, TdResponse, TdQueryParams } from '@covalent/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface IGroup {
  name?: string;
  description?: string;
  id?: string;
  display_name?: string;
  users?: string[];
}

@TdHttp({
  baseUrl: '/api/user',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
})
export class VantageGroupService {
  /**
   * get groups in paginated form via query string
   */
  @TdGET({
    path: '/groups',
    options: {
      observe: 'response',
    },
  })
  query(
    @TdQueryParams() queryParams?: HttpParams,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<{ total: number; data: IGroup[] }> {
    return response.pipe(
      catchError((error: Response) => {
        return of(error);
      }),
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <IGroup[]>res.body,
        };
      }),
    );
  }
}

export function VANTAGE_GROUP_PROVIDER_FACTORY(parent: VantageGroupService): VantageGroupService {
  return parent || new VantageGroupService();
}

export const VANTAGE_GROUP_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageGroupService,
  deps: [[new Optional(), new SkipSelf(), VantageGroupService]],
  useFactory: VANTAGE_GROUP_PROVIDER_FACTORY,
};
