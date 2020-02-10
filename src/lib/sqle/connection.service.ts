import { Injectable, Optional, SkipSelf, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';
import { VantageQueryService, ISQLEConnection } from './query.service';

const CONNECTION_SESSION_KEY: string = 'vantage.editor.connection';

@Injectable()
export class VantageConnectionService {
  constructor(private _queryService: VantageQueryService) {}

  public get current(): ISQLEConnection {
    try {
      return JSON.parse(sessionStorage.getItem(CONNECTION_SESSION_KEY));
    } catch {
      return undefined;
    }
  }

  public disconnect(): void {
    sessionStorage.removeItem(CONNECTION_SESSION_KEY);
  }

  public connect(connection: ISQLEConnection): Observable<ISQLEConnection> {
    // clear connection before starting a new one
    this.disconnect();
    // test connection with SELECT 1
    return this._queryService.querySystem(connection, { query: 'SELECT 1;' }).pipe(
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
