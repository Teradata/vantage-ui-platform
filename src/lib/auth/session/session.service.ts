import { map, catchError } from 'rxjs/operators';
import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { mixinHttp, TdGET, TdResponse, TdPOST, TdParam } from '@covalent/http';
import { Observable, of } from 'rxjs';
import { IUser } from '@td-vantage/ui-platform/user';

import { tap, switchMap } from 'rxjs/operators';

export interface ISessionUser {
  user?: string;
  valid?: boolean;
  admin?: boolean;
  groups?: string[];
  expires_at?: string;
}

@Injectable()
export class VantageSessionService extends mixinHttp(class {}, {
  baseUrl: '/api/user',
  baseHeaders: new HttpHeaders({
    Accept: 'application/json',
  }),
}) {
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
            }),
          );
        }),
      );
    } else {
      return of(this._user);
    }
  }

  public logout(): void {
    window.location.href = '/api/user/logout?nonce=' + Math.floor(1000000000 + Math.random() * 9000000000);
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
  private _get(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> {
    return response.pipe(
      map((res: HttpResponse<ISessionUser>) => {
        return res.body;
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
        return res.body;
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
