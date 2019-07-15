import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { VantageSessionService } from '../session/session.service';
import { timeout } from 'rxjs/operators';

const UNAUTHORIZED: number = 401;
@Injectable()
export class VantageAuthenticationGuard implements CanActivate {

  constructor(private _router: Router, private _sessionService: VantageSessionService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      // check the validity to see if already logged in
      await this._sessionService.getInfo().pipe(timeout(5000)).toPromise();
    } catch (e) {
      // if not logged in, go ahead and log in...otherwise logout
      // append the current path so we get redirected back upon login
      (e.status === UNAUTHORIZED) ? window.location.href = `/start-login${this._router.url}` : this._sessionService.logout();
      return false;
    }
    return true;
  }
}
