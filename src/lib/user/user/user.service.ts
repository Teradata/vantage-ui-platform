import { Provider, SkipSelf, Optional } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { TdHttp, TdGET, TdResponse, TdParam, TdQueryParams } from '@covalent/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface IUser {
  username?: string;
  password?: string;
  email?: string;
  local?: boolean;
  admin?: boolean;
  groups?: string[];
  display_name?: string;
  access_token?: string;
  expires_at?: number;
}

@TdHttp({
  baseUrl: '/api/user',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
})
export class VantageUserService {
  /**
   * get all users
   */
  @TdGET({
    path: '/users',
    options: {
      observe: 'response',
    },
  })
  query(
    @TdQueryParams() queryParams?: HttpParams,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<{ total: number; data: IUser[] }> {
    return response.pipe(
      catchError((error: Response) => {
        return of(error);
      }),
      map((res: HttpResponse<any>) => {
        return {
          total: +res.headers.get('X-Total'),
          data: <IUser[]>res.body,
        };
      }),
    );
  }

  /**
   * gets a single users information
   */
  @TdGET({
    path: '/users/:username',
    options: {
      observe: 'response',
    },
  })
  get(@TdParam('username') id: string, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<IUser> {
    return response.pipe(
      catchError((error: Response) => {
        return of(error);
      }),
      map((res: HttpResponse<IUser>) => {
        return <IUser>res.body;
      }),
    );
  }
}

export function VANTAGE_USER_PROVIDER_FACTORY(parent: VantageUserService): VantageUserService {
  return parent || new VantageUserService();
}

export const VANTAGE_USER_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageUserService,
  deps: [[new Optional(), new SkipSelf(), VantageUserService]],
  useFactory: VANTAGE_USER_PROVIDER_FACTORY,
};
