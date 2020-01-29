import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/*
 * These interfaces are duplicated in the system and the query service.
 * However, within the system service, SystemType includes Aster & Presto.
 * Whereas in the query service, they are excluded.
 * TODO: DRY this up
 */
enum SystemType {
  Teradata = 'TERADATA',
  // TODO: remove the following 2
  Aster = 'ASTER',
  Presto = 'PRESTO',
}
interface ISystemAttributes {
  attributes?: any;
}
interface IAbstractSystem {
  host?: string;
  port?: number;
  system_type?: SystemType;
  catalog?: string;
  schema?: string;
}
interface ISystem extends IAbstractSystem {
  attributes?: string;
  data_center?: string;
  environment?: string;
  id?: string;
  nickname?: string;
  platform_id?: number;
  system_attributes?: ISystemAttributes;
  version?: string;
}

export interface IQueryPayload {
  query: string;
  session?: string;
  logMech?: string;
  rowOffset?: number;
  rowLimit?: number;
  format?: string; // (default)-object, array, or csv
  includeColumns?: boolean;
  includeColumnsTypes?: boolean;
  spooledResultSet?: boolean;
  clientId?: string;
}

export interface IQueryResultSet {
  queueDuration: number;
  queryDuration: number;
  results: IQueryResultSetResult[];
}

export interface IQueryResultSetResult {
  data: { [name: string]: string }[];
  resultSet: boolean;
  rowCount: number;
  rowLimitExceeded: boolean;
  columns?: { [name: string]: string }[];
}

export interface IQueryInfo {
  success?: boolean;
  logTime?: string;
  error?: any;
  resultSet?: IQueryResultSet;
}

export interface ISQLEConnection {
  system: ISystem;
  creds?: string;
}

@Injectable()
export class VantageQueryService {
  constructor(private _httpClient: HttpClient) {}

  querySystem(connection: ISQLEConnection, payload: IQueryPayload): Observable<IQueryResultSet> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
      payload.logMech = connection.system.system_attributes.attributes.log_mech || 'DEFAULT';
    } else {
      payload.logMech = 'JWT';
    }
    payload.clientId = 'VANTAGE.EDITOR';
    const request: Observable<object> = this._httpClient.post(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries',
      payload,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  getTableInfo(connection: ISQLEConnection, databaseName: string, tableName: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');

    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }

    const request: Observable<object> = this._httpClient.get(
      `/api/query/systems/${connection.system.nickname}/databases/${databaseName}/tables/${tableName}`,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  getViewInfo(connection: ISQLEConnection, databaseName: string, viewName: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');

    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }

    const request: Observable<object> = this._httpClient.get(
      `/api/query/systems/${connection.system.nickname}/databases/${databaseName}/views/${viewName}`,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  getQuery(connection: ISQLEConnection, requestId: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }
    const request: Observable<object> = this._httpClient.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + requestId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: any) => {
        return resultSet;
      }),
    );
  }

  getQueries(connection: ISQLEConnection, sessionId: string): Observable<IQueryResultSet> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }
    const request: Observable<object> = this._httpClient.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries?session=' + sessionId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  getQueryResult(connection: ISQLEConnection, queryId: string): Observable<IQueryResultSet> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }
    const request: Observable<object> = this._httpClient.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + queryId + '/results',
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  deleteQuery(connection: ISQLEConnection, queryId: string): Observable<IQueryResultSet> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }
    const request: Observable<object> = this._httpClient.delete(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + queryId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  createSession(connection: ISQLEConnection): Observable<any> {
    const payload: any = {
      autoCommit: 'true',
      transactionMode: 'TERA',
      charSet: 'UTF8',
    };
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
      payload.logMech = connection.system.system_attributes.attributes.log_mech || 'DEFAULT';
    } else {
      payload.logMech = 'JWT';
    }
    const request: Observable<object> = this._httpClient.post(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/sessions',
      payload,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: any) => {
        return resultSet;
      }),
    );
  }

  deleteSession(connection: ISQLEConnection, sessionId: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
    }
    const request: Observable<object> = this._httpClient.delete(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/sessions/' + sessionId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw error.error;
      }),
      map((resultSet: any) => {
        return resultSet;
      }),
    );
  }
}

export function VANTAGE_QUERY_PROVIDER_FACTORY(
  parent: VantageQueryService,
  httpClient: HttpClient,
): VantageQueryService {
  return parent || new VantageQueryService(httpClient);
}

export const VANTAGE_QUERY_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageQueryService,
  deps: [[new Optional(), new SkipSelf(), VantageQueryService], HttpClient],
  useFactory: VANTAGE_QUERY_PROVIDER_FACTORY,
};
