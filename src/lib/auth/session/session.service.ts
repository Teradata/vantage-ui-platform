import { map, catchError } from 'rxjs/operators';
import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { TdHttp, TdGET, TdResponse, TdPOST, TdParam } from '@covalent/http';
import { Observable, of } from 'rxjs';

import { tap, switchMap } from 'rxjs/operators';

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

export interface ISessionUser {
  user?: string;
  valid?: boolean;
  admin?: boolean;
  groups?: string[];
  expires_at?: string;
}

@TdHttp({
  baseUrl: '/api/user',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
})
@Injectable()
export class VantageSessionService {

  private _user: IUser;

  get user(): IUser {
    return this._user;
  }

  getInfo(): Observable<IUser> {
    if (!this._user) {
      return this._get().pipe(
        switchMap((sessionUser: ISessionUser) => {
          return this._getUser(sessionUser.user).pipe(
            tap((u: IUser) => {
              this._user = Object.assign({}, sessionUser, u);
            },
          ));
        }),
      );
    } else {
      return of(this._user);
    }
  }

  async logout(): Promise<void> {
    try {
      return await this._logout().toPromise();
    } catch (e) {
      // ignore error
    } finally {
      document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.reload();
    }
  }

  /**
   * gets the current sso logged in users information
   */
  @TdPOST({
    path: '/token/validity?fields=user,groups',
    options: {
      observe: 'response',
    },
  })
  private _get(
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<any> {
    return response.pipe(
      map((res: HttpResponse<ISessionUser>) => {
        return res.body;
      }),
    );
  }

  @TdGET({
    path: '/logout?session=true',
    options: {
      observe: 'response',
    },
  })
  private _logout(
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<any> {
    return response.pipe(
      map((res: HttpResponse<any>) => {
        return res;
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
  private _getUser(
    @TdParam('username') id: string,
    @TdResponse() response?: Observable<HttpResponse<any>>,
  ): Observable<IUser> {
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

export function VANTAGE_SESSION_PROVIDER_FACTORY(parent: VantageSessionService): VantageSessionService {
  return parent || new VantageSessionService();
}

export const VANTAGE_SESSION_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageSessionService,
  deps: [[new Optional(), new SkipSelf(), VantageSessionService]],
  useFactory: VANTAGE_SESSION_PROVIDER_FACTORY,
};
