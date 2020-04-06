import { Injectable, Optional, SkipSelf, Provider } from '@angular/core';

import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, tap, timeout, mapTo } from 'rxjs/operators';

import { VantageQueryService, ISQLEConnection } from './query.service';

const CONNECTION_SESSION_KEY: string = 'vantage.editor.connection';

export function current(): ISQLEConnection {
  try {
    return JSON.parse(sessionStorage.getItem(CONNECTION_SESSION_KEY));
  } catch {
    return undefined;
  }
}

@Injectable()
export class VantageConnectionService {
  constructor(private _queryService: VantageQueryService) {}

  public get current(): ISQLEConnection {
    return current();
  }

  public disconnect(): void {
    sessionStorage.removeItem(CONNECTION_SESSION_KEY);
  }

  public connect(
    connection: ISQLEConnection,
    opts?: { timeout: number; attempts: number },
  ): Observable<ISQLEConnection> {
    // clear connection before starting a new one
    this.disconnect();
    // test connection with SELECT 1
    return this._queryService.querySystem(connection, { query: 'SELECT 1;' }).pipe(
      // timeout connection if more than 7 seconds
      timeout(opts?.timeout || 7000),
      // retry only after a certain number of attempts or if the error is something else than 420
      retryWhen((errors: Observable<{ httpStatus: number }>) => {
        return errors.pipe(
          mergeMap((error: { httpStatus: number }, index: number) => {
            const retryAttempt: number = index + 1;
            if (retryAttempt > (opts?.attempts || 2) || error.httpStatus === 420) {
              return throwError(error);
            }
            return timer(0);
          }),
        );
      }),
      tap(() => this.store(connection)), // if successful, save
      mapTo(connection),
    );
  }

  private store({ system, creds }: ISQLEConnection): void {
    sessionStorage.setItem(CONNECTION_SESSION_KEY, JSON.stringify({ system, creds }));
  }
}

export function VANTAGE_CONNECTION_PROVIDER_FACTORY(
  parent: VantageConnectionService,
  queryService: VantageQueryService,
): VantageConnectionService {
  return parent || new VantageConnectionService(queryService);
}

export const VANTAGE_CONNECTION_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageConnectionService,
  deps: [[new Optional(), new SkipSelf(), VantageConnectionService], VantageQueryService],
  useFactory: VANTAGE_CONNECTION_PROVIDER_FACTORY,
};
