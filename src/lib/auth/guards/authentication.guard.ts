import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { VantageSessionService } from '../session/session.service';

@Injectable()
export class VantageAuthenticationGuard implements CanActivate {

  constructor(private _router: Router, private _sessionService: VantageSessionService) {}

  getCookiebyName(name: string): string {
    let pair: string[] = document.cookie.match(new RegExp(name + '=([^;]+)'));
    return !!pair ? pair[1] : undefined;
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let xsrfToken: string = this.getCookiebyName('XSRF-TOKEN');
    if (!xsrfToken) {
      window.location.href = '/start-login';
      return false;
    } else {
      try {
        await this._sessionService.getInfo().toPromise();
      } catch (e) {
        this._sessionService.logout();
        return false;
      }
    }
    return true;
  }
}
