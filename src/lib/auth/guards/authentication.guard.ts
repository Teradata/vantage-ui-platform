import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { VantageSessionService } from '../session/session.service';

import { Observable } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';

const UNAUTHORIZED: number = 401;

@Injectable()
export class VantageAuthenticationGuard implements CanActivate {
  constructor(private _router: Router, private _sessionService: VantageSessionService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._sessionService
      .getInfo()
      .pipe(timeout(5000))
      .pipe(
        catchError((e: HttpErrorResponse) => {
          // if not logged in, go ahead and log in...otherwise logout
          // append the current path so we get redirected back upon login
          e.status === UNAUTHORIZED ? (window.location.href = '/start-login') : this._sessionService.logout();
          throw e;
        }),
        map(() => {
          return true;
        }),
      );
  }
}
