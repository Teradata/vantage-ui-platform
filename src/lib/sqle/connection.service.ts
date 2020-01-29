import { Injectable, Optional, SkipSelf, Provider } from '@angular/core';
import { retry, timeout } from 'rxjs/operators';
import { ISQLEConnection, VantageQueryService } from './query.service';

const CONNECTION_SESSION_KEY: string = 'vantage.editor.connection';

@Injectable()
export class VantageConnectionService {
  constructor(private _queryService: VantageQueryService) {}

  public get current(): ISQLEConnection {
    return JSON.parse(sessionStorage.getItem(CONNECTION_SESSION_KEY));
  }

  public disconnect(): void {
    sessionStorage.removeItem(CONNECTION_SESSION_KEY);
  }

  public async connect(connection: ISQLEConnection): Promise<void> {
    // clear connection before starting a new one
    this.disconnect();
    // test connection with SELECT 1
    await this._queryService
      .querySystem(connection, { query: 'SELECT 1;' })
      .pipe(timeout(7000), retry(1))
      .toPromise();
    // if successful, save
    this.store(connection);
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
