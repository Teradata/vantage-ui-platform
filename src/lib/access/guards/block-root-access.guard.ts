import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { VantageSessionService, VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';

/**
 * Guard that checks if the user is root (`admin` flag `true`)
 * to block access into a particular route.
 * If `admin` flag is `true`, then we redirect to `/`
 */
@Injectable()
export class VantageBlockRootAccessGuard implements CanActivate {
  constructor(private _authGuard: VantageAuthenticationGuard, private _sessionService: VantageSessionService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // pipe through the VantageAuthentication guard to be able to chain guards
    return this._authGuard.canActivate(next, state).pipe(
      map(() => {
        if (this._sessionService.user.admin) {
          location.replace('/');
          return false;
        }
        return true;
      }),
    );
  }
}
