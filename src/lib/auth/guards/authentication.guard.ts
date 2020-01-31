import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { VantageSessionService } from '../session/session.service';
import { Observable } from 'rxjs';
import { timeout, catchError, map, finalize } from 'rxjs/operators';

const UNAUTHORIZED: number = 401;

@Injectable()
export class VantageAuthenticationGuard implements CanActivate {
  constructor(private _router: Router, private _sessionService: VantageSessionService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    showPreLoader();
    return this._sessionService.getInfo().pipe(
      timeout(5000),
      catchError((e: HttpErrorResponse) => {
        // if not logged in, go ahead and log in...otherwise logout
        // append the current path so we get redirected back upon login
        e.status === UNAUTHORIZED
          ? (window.location.href = '/start-login?nonce=' + Math.floor(1000000000 + Math.random() * 9000000000))
          : this._sessionService.logout();
        throw e;
      }),
      map(() => true),
      finalize(() => hidePreLoader()),
    );
  }
}

// PRE_LOADER_COUNT variable is defined inside pre-loader.html

function showPreLoader(): void {
  if ((<any>window).PRE_LOADER_COUNT !== undefined) {
    (<any>window).PRE_LOADER_COUNT++;
    updatePreLoaderVisibility();
  }
}

function hidePreLoader(): void {
  if ((<any>window).PRE_LOADER_COUNT !== undefined) {
    (<any>window).PRE_LOADER_COUNT--;
    updatePreLoaderVisibility();
  }
}

function updatePreLoaderVisibility(): void {
  const loader: HTMLElement = document.getElementById('td-pre-loader');
  if (loader) {
    loader.style.height = (<any>window).PRE_LOADER_COUNT > 0 ? '100%' : '0';
    loader.style.opacity = (<any>window).PRE_LOADER_COUNT > 0 ? '1' : '0';
  }
}
