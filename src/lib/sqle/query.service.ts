import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ISystem } from '@td-vantage/ui-platform/system';
import { TdHttpService } from '@covalent/http';

export enum QueryResultColumnTypes {
  // Array
  'ARRAY' = 'ARRAY',
  'VARRAY' = 'VARRAY',

  // Byte
  'BLOB' = 'BLOB',
  'BYTE' = 'BYTE',
  'VARBYTE' = 'VARBYTE',

  // Numeric
  'BIGINT' = 'BIGINT',
  'BYTEINT' = 'BYTEINT',
  'DECIMAL' = 'DECIMAL',
  'DOUBLE PRECISION' = 'DOUBLE PRECISION',
  'FLOAT' = 'FLOAT',
  'INTEGER' = 'INTEGER',
  'NUMBER' = 'NUMBER',
  'NUMERIC' = 'NUMERIC',
  'REAL' = 'REAL',
  'SMALLINT' = 'SMALLINT',

  // DateTIme
  'DATE' = 'DATE',
  'TIME' = 'TIME',
  'TIMESTAMP' = 'TIMESTAMP',
  'TIME WITH TIME ZONE' = 'TIME WITH TIME ZONE',
  'TIMESTAMP WITH TIME ZONE' = 'TIMESTAMP WITH TIME ZONE',

  // Interval
  'INTERVAL' = 'INTERVAL',

  'INTERVAL DAY' = 'INTERVAL DAY',
  'INTERVAL DAY TO HOUR' = 'INTERVAL DAY TO HOUR',
  'INTERVAL DAY TO MINUTE' = 'INTERVAL DAY TO MINUTE',
  'INTERVAL DAY TO SECOND' = 'INTERVAL DAY TO SECOND',

  'INTERVAL HOUR' = 'INTERVAL HOUR',
  'INTERVAL HOUR TO MINUTE' = 'INTERVAL HOUR TO MINUTE',
  'INTERVAL HOUR TO SECOND' = 'INTERVAL HOUR TO SECOND',

  'INTERVAL MINUTE' = 'INTERVAL MINUTE',
  'INTERVAL MINUTE TO SECOND' = 'INTERVAL MINUTE TO SECOND',

  'INTERVAL MONTH' = 'INTERVAL MONTH',
  'INTERVAL SECOND' = 'INTERVAL SECOND',
  'INTERVAL YEAR' = 'INTERVAL YEAR',
  'INTERVAL YEAR TO MONTH' = 'INTERVAL YEAR TO MONTH',

  // Character
  'CHAR' = 'CHAR',
  'CHARACTER' = 'CHARACTER',
  'CHARACTER SET GRAPHIC' = 'CHARACTER SET GRAPHIC',
  'CLOB' = 'CLOB',
  'CHAR VARYING' = 'CHAR VARYING',
  'LONG VARCHAR' = 'LONG VARCHAR',
  'VARCHAR' = 'VARCHAR',

  // Period
  'PERIOD' = 'PERIOD',

  // UDT
  'udt_name' = 'udt_name',

  // Parameter
  'TD_ANYTYPE' = 'TD_ANYTYPE',
  'VARIANT_TYPE' = 'VARIANT_TYPE',
}

export interface IQueryBands {
  ApplicationName: string;
  Version: string;
  ClientUser?: string;
  [name: string]: string;
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
  outputNumbersAsStrings?: boolean;
  spooledResultSet?: boolean;
  clientId?: string;
  queryBands?: IQueryBands;
}

export interface IQueryResultSet {
  queueDuration: number;
  queryDuration: number;
  results: IQueryResultSetResult[];
}

export interface IQueryResultData {
  [name: string]: string | number;
}

export interface IQueryResultSetResult {
  data: IQueryResultData[];
  resultSet: boolean;
  rowCount: number;
  rowLimitExceeded: boolean;
  columns?: IQueryResultSetColumn[];
}

export interface IQueryResultSetColumn {
  name: string;
  type: keyof typeof QueryResultColumnTypes;
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

export interface ISessionPayload {
  autoCommit: string;
  transactionMode: string;
  charSet: string;
  defaultDatabase?: string;
  logMech?: string;
  queryBands?: IQueryBands;
}

@Injectable()
export class VantageQueryService {
  constructor(private _http: TdHttpService) {}

  querySystem(connection: ISQLEConnection, payload: IQueryPayload): Observable<IQueryResultSet> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
      const attributes: { [key: string]: string } = connection.system.system_attributes?.attributes;
      payload.logMech = attributes?.log_mech || attributes?.logMech || 'DEFAULT';
    } else {
      payload.logMech = 'JWT';
    }
    payload.clientId = 'VANTAGE.EDITOR';
    const request: Observable<object> = this._http.post(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries',
      payload,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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

    const request: Observable<object> = this._http.get(
      `/api/query/systems/${connection.system.nickname}/databases/${databaseName}/tables/${tableName}`,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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

    const request: Observable<object> = this._http.get(
      `/api/query/systems/${connection.system.nickname}/databases/${databaseName}/views/${viewName}`,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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
    const request: Observable<object> = this._http.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + requestId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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
    const request: Observable<object> = this._http.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries?session=' + sessionId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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
    const request: Observable<object> = this._http.get(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + queryId + '/results',
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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
    const request: Observable<object> = this._http.delete(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/queries/' + queryId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
      }),
      map((resultSet: IQueryResultSet) => {
        return resultSet;
      }),
    );
  }

  createSession(
    connection: ISQLEConnection,
    payload: ISessionPayload = { autoCommit: 'true', transactionMode: 'TERA', charSet: 'UTF8' },
  ): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders()
      .append('Accept', 'application/vnd.com.teradata.rest-v1.0+json')
      .append('Content-Type', 'application/json');
    if (connection.creds) {
      headers = headers.set('X-Auth-Credentials', 'Basic ' + connection.creds);
      const attributes: { [key: string]: string } = connection.system.system_attributes?.attributes;
      payload.logMech = attributes?.log_mech || attributes?.logMech || 'DEFAULT';
    } else {
      payload.logMech = 'JWT';
    }
    const request: Observable<object> = this._http.post(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/sessions',
      payload,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
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
    const request: Observable<object> = this._http.delete(
      '/api/query/tdrest/systems/' + connection.system.nickname + '/sessions/' + sessionId,
      { headers },
    );

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        throw Object.assign({}, error.error, { httpStatus: error.status });
      }),
      map((resultSet: any) => {
        return resultSet;
      }),
    );
  }
}

export function VANTAGE_QUERY_PROVIDER_FACTORY(
  parent: VantageQueryService,
  tdHttpService: TdHttpService,
): VantageQueryService {
  return parent || new VantageQueryService(tdHttpService);
}

export const VANTAGE_QUERY_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageQueryService,
  deps: [[new Optional(), new SkipSelf(), VantageQueryService], TdHttpService],
  useFactory: VANTAGE_QUERY_PROVIDER_FACTORY,
};
