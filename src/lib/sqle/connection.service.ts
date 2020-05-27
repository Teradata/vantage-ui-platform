import { Injectable, Optional, SkipSelf, Provider } from '@angular/core';
import { Observable, throwError, timer, BehaviorSubject } from 'rxjs';
import { mergeMap, retryWhen, tap, timeout, mapTo } from 'rxjs/operators';
import { VantageQueryService, ISQLEConnection } from './query.service';
import { VantageSessionService } from '@td-vantage/ui-platform/auth';

const CONNECTION_SESSION_KEY: string = 'vantage.editor.connection';

interface IVantageConnectionState {
  current?: ISQLEConnection;
  connections: ISQLEConnection[];
  username: string;
}

export interface IConnectOptions {
  timeout: number;
  attempts: number;
}

export function stringifyConnection(connection: ISQLEConnection): string {
  if (connection) {
    return `${connection.system.nickname}${connection.creds}`;
  }
}

@Injectable()
export class VantageConnectionService {
  private readonly _currentConnectionSubject: BehaviorSubject<ISQLEConnection> = new BehaviorSubject<ISQLEConnection>(
    this._getConnectionState().current,
  );
  private readonly _connectionsSubject: BehaviorSubject<ISQLEConnection[]> = new BehaviorSubject<ISQLEConnection[]>(
    this._getConnectionState().connections,
  );
  public currentConnection$: Observable<ISQLEConnection> = this._currentConnectionSubject.asObservable();
  public connections$: Observable<ISQLEConnection[]> = this._connectionsSubject.asObservable();

  constructor(private _queryService: VantageQueryService, private _sessionService: VantageSessionService) {
    const connectionState: IVantageConnectionState = this._getConnectionState();
    if (connectionState && connectionState.username !== this._currentUsername) {
      // mismatch, so clear
      this._connections = [];
      this._currentConnection = undefined;
    }
  }

  private set _currentConnection(connection: ISQLEConnection) {
    this._setConnectionState({
      current: connection,
      connections: this._connections,
      username: this._currentUsername,
    });
    this._currentConnectionSubject.next(connection);
  }
  private get _currentConnection(): ISQLEConnection {
    return this._currentConnectionSubject.getValue();
  }
  public get currentConnection(): ISQLEConnection {
    return this._currentConnection;
  }

  private set _connections(connections: ISQLEConnection[]) {
    this._setConnectionState({
      current: this._currentConnection,
      connections,
      username: this._currentUsername,
    });
    this._connectionsSubject.next(connections);
  }
  private get _connections(): ISQLEConnection[] {
    return this._connectionsSubject.getValue();
  }
  public get connections(): ISQLEConnection[] {
    return this._connections;
  }

  public addConnectionAndConnect(connection: ISQLEConnection, options?: IConnectOptions): Observable<ISQLEConnection> {
    if (this._getConnectionIndex(connection) > -1) {
      throw Error('Connection already exists');
    } else {
      return this._pingAndSave(connection, true, options);
    }
  }

  public addConnection(connection: ISQLEConnection, options?: IConnectOptions): Observable<ISQLEConnection> {
    if (this._getConnectionIndex(connection) > -1) {
      throw Error('Connection already exists');
    } else {
      return this._pingAndSave(connection, false, options);
    }
  }

  public connectToExistingConnection(
    connection: ISQLEConnection,
    options?: IConnectOptions,
  ): Observable<ISQLEConnection> {
    if (this._getConnectionIndex(connection) > -1) {
      return this._pingAndSave(connection, true, options);
    } else {
      throw Error('Connection does not exist');
    }
  }
  public removeConnection(connection: ISQLEConnection): ISQLEConnection {
    const index: number = this._getConnectionIndex(connection);
    if (index > -1) {
      this._connections = [...this._connections.slice(0, index), ...this._connections.slice(index + 1)];
      this._currentConnection =
        this._currentConnection && this._connectionsAreEqual(this._currentConnection, connection)
          ? undefined
          : this._currentConnection;
      return connection;
    } else {
      // connection does not exist but that is fine?
      return undefined;
    }
  }

  public disconnectFromCurrentConnection(): void {
    this._currentConnection = undefined;
  }

  public removeAllConnections(): void {
    this._connections = [];
    this._currentConnection = undefined;
  }

  public connectionExits(connection: ISQLEConnection): boolean {
    return this._getConnectionIndex(connection) > -1;
  }

  public connectionIsCurrentConnection(connection: ISQLEConnection): boolean {
    return this._connectionsAreEqual(connection, this.currentConnection);
  }

  public stringifyConnection(connection: ISQLEConnection): string {
    return stringifyConnection(connection);
  }

  private _pingAndSave(
    connection: ISQLEConnection,
    setAsCurrent: boolean,
    opts: IConnectOptions = { attempts: 2, timeout: 7000 },
  ): Observable<ISQLEConnection> {
    // test connection with SELECT 1
    return this._queryService.querySystem(connection, { query: 'SELECT 1;' }).pipe(
      // timeout connection if more than 7 seconds
      timeout(opts.timeout),
      // retry only after a certain number of attempts or if the error is something else than 420
      retryWhen((errors: Observable<{ httpStatus: number }>) => {
        return errors.pipe(
          mergeMap((error: { httpStatus: number }, index: number) => {
            const retryAttempt: number = index + 1;
            if (retryAttempt > opts.attempts || error.httpStatus === 420) {
              return throwError(error);
            }
            return timer(0);
          }),
        );
      }),
      tap(() => {
        // if successful, save
        const index: number = this._getConnectionIndex(connection);
        if (index === -1) {
          this._connections = [...this._connections, connection];
        }
        if (setAsCurrent) {
          this._currentConnection = connection;
        }
      }),
      mapTo(connection),
    );
  }

  private get _currentUsername(): string {
    return this._sessionService.user && this._sessionService.user.username;
  }

  private _connectionsAreEqual(connectionA: ISQLEConnection, connectionB: ISQLEConnection): boolean {
    return connectionA.creds === connectionB.creds && connectionA.system.nickname === connectionB.system.nickname;
  }

  private _getConnectionIndex(connection: ISQLEConnection): number {
    return this.connections.findIndex((conn: ISQLEConnection) => this._connectionsAreEqual(connection, conn));
  }

  private _getConnectionState(): IVantageConnectionState {
    try {
      const connectionState: IVantageConnectionState = JSON.parse(sessionStorage.getItem(CONNECTION_SESSION_KEY));
      if (connectionState) {
        return connectionState;
      }
      return {
        username: undefined,
        current: undefined,
        connections: [],
      };
    } catch {
      return {
        username: undefined,
        current: undefined,
        connections: [],
      };
    }
  }

  private _setConnectionState(connectionState: IVantageConnectionState): void {
    sessionStorage.setItem(CONNECTION_SESSION_KEY, JSON.stringify(connectionState));
  }
}

export function VANTAGE_CONNECTION_PROVIDER_FACTORY(
  parent: VantageConnectionService,
  queryService: VantageQueryService,
  sessionService: VantageSessionService,
): VantageConnectionService {
  return parent || new VantageConnectionService(queryService, sessionService);
}

export const VANTAGE_CONNECTION_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageConnectionService,
  deps: [[new Optional(), new SkipSelf(), VantageConnectionService], VantageQueryService, VantageSessionService],
  useFactory: VANTAGE_CONNECTION_PROVIDER_FACTORY,
};
