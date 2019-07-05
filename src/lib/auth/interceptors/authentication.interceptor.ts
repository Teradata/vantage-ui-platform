import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ITdHttpInterceptor } from '@covalent/http';

/* 4XX errors */
const UNAUTHORIZED: number = 401;
const PAYLOAD_TOO_LARGE: number = 413;

/* 5XX errors */
const SERVICE_UNAVAILABLE: number = 503;
const GATEWAY_TIMEOUT: number = 504;

@Injectable()
export class VantageAuthenticationInterceptor implements ITdHttpInterceptor {

  onResponseError(error: any): any {
    if (error.status === UNAUTHORIZED) {
      // expire the xsrf cookie and reload page
      document.cookie = 'XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.reload();
    } 
    return error;
  }

  handleResponse(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      catchError((e: any) => {
        // check error and do something
        if (e instanceof HttpErrorResponse) {
          // do something if its response error
         return this.onResponseError(e);
        }
      }),
    );
  }
}
