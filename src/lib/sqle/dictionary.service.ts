import { Injectable, SkipSelf, Optional, Provider } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { VantageQueryService, IQueryResultSet, IQueryPayload, ISQLEConnection } from './query.service';

export const sysDatabases: string[] = [
  'DBC',
  'dbcmngr',
  'SQLJ',
  'SystemFe',
  'SysAdmin',
  'SYSBAR',
  'SYSJDBC',
  'SYSLIB',
  'SYSUDTLIB',
  'TDMaps',
  'TD_SERVER_DB',
  'TD_SYSFNLIB',
  'TD_SYSXML',
  'Sys_Calendar',
];

export interface IDictionarySystem {
  hostname?: string;
  password?: string;
  port?: number;
  system_id?: string;
  last_run?: string;
  interval_minutes?: number;
  enabled?: boolean;
  last_attempt?: string;
  in_collection?: boolean;
  username?: string;
}

export interface IDictionaryDatabase {
  parent_name?: string;
  size_bytes?: number;
  system_id?: string;
  name?: string;
  id?: string;
  type?: string;
}

export interface IDictionaryDatabaseObject {
  system_id?: string;
  database_id?: string;
  id?: string;
  name?: string;
  size_bytes?: number;
  type?: string;
  create_text?: string;
}

export interface IDictionaryTableColumn {
  system_id?: string;
  database_id?: string;
  table_id?: string;
  id?: string;
  name?: string;
}

/**
 * FunctionType
 * A - Aggregate
 * B - Aggregate and statistical
 * C - Contract function
 * D - External stored procedure
 * F - Scalar
 * H - User defined method
 * I - Internal type method
 * L - Table operator
 * R - Table Function
 * S - Statistical
 */

/**
 * TableKind for dbc.tablesvx;
 * A - Aggregate function
 * B - Combined aggregate and ordered analytical function
 * C - Table operator parser contract function
 * D - JAR
 * E - External Stored Procedure
 * F - Standard Function
 * G - Trigger
 * H - Instance or contructor method
 * I - Join Index
 * J - Journal
 * K - Foreign Server Object
 * L - User defined table operator
 * M - Macro
 * N - Hash index
 * O - Table with no primary index and no partitioning
 * P - Stored Procedure
 * Q - Queue table
 * R - Table function
 * S - Ordered Analytical function
 * T - table with a primary index or primary AMP index, partitioning or both. Or a partioned table with NoPI;
 * U - User defined type
 * V - View
 * X - Authorization
 * Y - GLOP set
 * Z - UIF - User Installed File
 * 1 - A DATASET schema object created by CREATE SCHEMA
 * 2 - Functon alias object
 */

/**
 * dbc.externalSPs
 * dbc.sessionInfovx
 */

@Injectable()
export class VantageDictionaryService {
  constructor(private _queryService: VantageQueryService) {}

  async getFrequencyAnalysis(
    connection: ISQLEConnection,
    database: string,
    table: string,
    column: string,
  ): Promise<any> {
    const requests: any[] = [];
    const session: any = await this._queryService.createSession(connection).toPromise();
    const payload: IQueryPayload = {
      query: `
        call demouser.td_analyze('frequency', 'database=${database};tablename=${table};columns=${column};');
      `,
      session: session.sessionId,
      rowLimit: 10000,
    };
    requests.push(this._queryService.querySystem(connection, payload));

    const resultSets: IQueryResultSet[] = [];
    try {
      for (const request of requests) {
        resultSets.push(await request.toPromise());
      }
    } finally {
      await this._queryService.deleteSession(connection, session.sessionId).toPromise();
    }
    const rows: any[] = resultSets[0].results[0].data.map((row: any) => {
      return {
        value: row.xval,
        percent: row.xpct,
      };
    });
    return {
      database,
      table,
      column,
      frequency: rows,
    };
  }

  async getValuesAnalysis(connection: ISQLEConnection, database: string, table: string, column: string): Promise<any> {
    const requests: any[] = [];
    const session: any = await this._queryService.createSession(connection).toPromise();
    const payload: IQueryPayload = {
      query: `
        call demouser.td_analyze('values', 'database=${database};tablename=${table};columns=${column};');
      `,
      session: session.sessionId,
      rowLimit: 10000,
    };
    requests.push(this._queryService.querySystem(connection, payload));

    const resultSets: IQueryResultSet[] = [];
    try {
      for (const request of requests) {
        resultSets.push(await request.toPromise());
      }
    } finally {
      await this._queryService.deleteSession(connection, session.sessionId).toPromise();
    }

    const row: any = resultSets[0].results[0].data[0];

    return {
      database,
      table,
      column,
      type: row.xtype,
      count: row.xcnt,
      zeros: row.xzero,
      negatives: row.xneg,
      positives: row.xpos,
      blanks: row.xblank,
      nulls: row.xnull,
      uniques: row.xunique,
    };
  }

  getViewHelp(connection: ISQLEConnection, database: string, view: string): Observable<any> {
    const queryStr: string = `
      LOCK ROW FOR ACCESS
      SELECT CAST(COUNT(*) AS BIGINT) as cnt
      FROM ${database}.${view};
      SHOW VIEW ${database}.${view};
    `;

    return this._queryService.getViewInfo(connection, database, view).pipe(
      map((resultSet: any) => {
        return resultSet.columns.map((column: any) => {
          return {
            comment: column.remarks,
            type: 'column',
            columnType: column.type,
            name: column.name,
            database: resultSet.database,
            table: resultSet.name,
          };
        });
      }),
      switchMap((viewInfo: any) => {
        return this._queryService
          .querySystem(connection, {
            query: queryStr,
          })
          .pipe(
            map((resultSet: IQueryResultSet) => {
              let ddlStatement: string = '';
              resultSet.results[1].data.forEach((row: any) => {
                ddlStatement += row['Request Text'];
              });
              let count: string;
              resultSet.results[0].data.forEach((row: any) => {
                count = row.cnt;
              });

              const columns: any[] = viewInfo.map((row: any) => {
                return {
                  columnName: row.name,
                  type: row.columnType,
                };
              });

              return {
                database,
                view,
                columns,
                count,
                ddlStatement,
              };
            }),
          );
      }),
    );
  }

  getTableHelp(connection: ISQLEConnection, database: string, table: string): Observable<any> {
    const queryStr: string = `
      LOCK ROW FOR ACCESS
      SELECT CAST(COUNT(*) AS BIGINT) as cnt
      FROM ${database}.${table};
      SHOW TABLE ${database}.${table};
    `;
    return this._queryService.getTableInfo(connection, database, table).pipe(
      map((resultSet: any) => {
        return resultSet.columns.map((column: any) => {
          return {
            comment: column.remarks,
            type: 'column',
            columnType: column.type,
            name: column.name,
            database: resultSet.database,
            table: resultSet.name,
          };
        });
      }),
      switchMap((info: any) => {
        return this._queryService
          .querySystem(connection, {
            query: queryStr,
          })
          .pipe(
            map((resultSet: IQueryResultSet) => {
              let ddlStatement: string = '';
              resultSet.results[1].data.forEach((row: any) => {
                ddlStatement += row['Request Text'];
              });
              let count: string;
              resultSet.results[0].data.forEach((row: any) => {
                count = row.cnt;
              });
              const columns: any[] = info.map((row: any) => {
                return {
                  columnName: row.name,
                  type: row.columnType,
                };
              });
              return {
                database,
                table,
                columns,
                count,
                ddlStatement,
              };
            }),
          );
      }),
    );
  }

  getDatabaseFunction(connection: ISQLEConnection, funcName: string): Observable<any> {
    const queryStr: string = `
      HELP 'SQL ${funcName}';
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          const stringArray: string[] = resultSet.results[0].data.map((row: any) => {
            return row['On-Line Help'];
          });
          return stringArray.join(' ');
        }),
      );
  }

  getDatabaseFunctions(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      HELP 'SQL';
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          const stringArray: string[] = resultSet.results[0].data.map((row: any) => {
            return row['On-Line Help'];
          });
          let sqlHelp: string = stringArray.join(' ');
          const index: number = sqlHelp.indexOf('FUNCTIONS') + 12;
          sqlHelp = sqlHelp.substr(index, sqlHelp.length);
          return sqlHelp
            .split(' ')
            .filter((func: string) => {
              return func;
            })
            .map((func: string) => {
              return {
                name: func,
              };
            });
        }),
      );
  }

  getAnalyticalFunctions(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      HELP FOREIGN SCHEMA "public"@coprocessor;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: any) => {
            return {
              name: row.objectname,
            };
          });
        }),
      );
  }

  getAnalyticalFunction(connection: ISQLEConnection, analyticalFunction: string): Observable<any> {
    const queryStr: string = `
      HELP FOREIGN FUNCTION "public"."${analyticalFunction}"@coprocessor;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          let functionName: string = '';
          let shortDescription: string = '';
          let longDescription: string = '';
          let usageSyntax: string = '';
          let inputColumns: string = '';
          let outputColumns: string = '';
          const functionOwner: string = '';
          const creationTime: string = '';
          const functionVersion: string = '';
          const interfacesImplemented: string = '';
          const stringArray: string[] = resultSet.results[0].data.map((row: any) => {
            return row['Function Help'];
          });
          for (let index: number = 0; index < stringArray.length; index++) {
            const value: string = stringArray[index];
            if (value.indexOf('Function Name:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                functionName += stringArray[index] + '\n';
              }
            } else if (value.indexOf('Short Description:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                shortDescription += stringArray[index] + '\n';
              }
            } else if (value.indexOf('Long Description:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                longDescription += stringArray[index] + '\n';
              }
            } else if (value.indexOf('Usage Syntax:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                usageSyntax += stringArray[index] + '\n';
              }
            } else if (value.indexOf('Input Columns:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                inputColumns += stringArray[index] + '\n';
              }
            } else if (value.indexOf('Output Columns:') > -1) {
              for (index++; index < stringArray.indexOf(''); index++) {
                outputColumns += stringArray[index] + '\n';
              }
            } else {
              // Function Owner:
              // Creation Time:
              // Function Version:
              // Interfaces Implemented:
              if (stringArray.indexOf('') > -1) {
                index = stringArray.indexOf('');
                stringArray[index] = undefined;
              }
            }
          }
          return {
            functionName,
            shortDescription,
            longDescription,
            usageSyntax,
            inputColumns,
            outputColumns,
          };
        }),
      );
  }

  resultSetPredicate(resultSet: IQueryResultSet): any {
    return resultSet.results[0].data.map((row: any) => {
      return {
        name: row.TableName,
        requestText: row.RequestText,
        comment: row.CommentString,
        kind: row.TableKind,
      };
    });
  }

  getStoredProcedures(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      SELECT DataBaseName, TableName, TableKind, RequestText, CommentString FROM dbc.tablesvx
      WHERE TableKind = 'P'
      ORDER BY TableName ASC;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(map(this.resultSetPredicate));
  }

  getExternalStoredProcedures(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      SELECT DataBaseName, TableName, TableKind, RequestText, CommentString FROM dbc.tablesvx
      WHERE TableKind = 'E'
      ORDER BY TableName ASC;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(map(this.resultSetPredicate));
  }

  getMacros(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      SELECT DataBaseName, TableName, TableKind, RequestText, CommentString FROM dbc.tablesvx
      WHERE TableKind = 'M'
      ORDER BY TableName ASC;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(map(this.resultSetPredicate));
  }

  functionsvxPredicate(resultSet: IQueryResultSet): any {
    return resultSet.results[0].data.map((row: any) => {
      return {
        database: row.DatabaseName,
        name: row.SpecificName,
        paramNumber: row.NumParameters,
        paramDataTypes: row.ParameterDataTypes,
        requestText: row.RequestText,
        commentString: row.CommentString,
        kind: row.TableKind,
      };
    });
  }

  getTableOperators(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      SELECT func.DatabaseName, func.FunctionName, func.SpecificName, func.NumParameters,
      func.ParameterDataTypes, tbl.RequestText, tbl.CommentString, tbl.TableKind
      FROM dbc.functionsvx as func
      INNER JOIN dbc.tablesvx as tbl
      ON tbl.TableName = func.SpecificName
      AND tbl.DataBaseName = func.DatabaseName
      WHERE FunctionType = 'L'
      ORDER BY func.FunctionName ASC;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(map(this.functionsvxPredicate));
  }

  getTableFunctions(connection: ISQLEConnection): Observable<any> {
    const queryStr: string = `
      SELECT func.DatabaseName, func.FunctionName, func.SpecificName, func.NumParameters,
      func.ParameterDataTypes, tbl.RequestText, tbl.CommentString, tbl.TableKind
      FROM dbc.functionsvx as func
      INNER JOIN dbc.tablesvx as tbl
      ON tbl.TableName = func.SpecificName
      AND tbl.DataBaseName = func.DatabaseName
      WHERE FunctionType = 'R'
      ORDER BY func.FunctionName ASC;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(map(this.functionsvxPredicate));
  }

  getForeignServers(connection: ISQLEConnection): Observable<any[]> {
    const queryStr: string = `
      SELECT TableName, TableKind FROM DBC.TABLESVX
      WHERE DATABASENAME = 'TD_SERVER_DB' AND
      TABLEKIND = 'K' AND
      TableName <> 'coprocesor';
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: any) => {
            return {
              name: row.TableName,
              kind: row.TableKind,
            };
          });
        }),
      );
  }

  getForeignSchemas(connection: ISQLEConnection, foreignServer: string): Observable<any[]> {
    const queryStr: string = `
      HELP FOREIGN SERVER ${foreignServer};
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: { Schema: string }) => {
            return {
              name: row.Schema,
              kind: 'NONE',
            };
          });
        }),
      );
  }

  getForeignTables(connection: ISQLEConnection, foreignServer: string, schema: string): Observable<any[]> {
    const queryStr: string = `
      HELP FOREIGN DATABASE "${schema}"@${foreignServer};
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: { Table: string }) => {
            return {
              name: row.Table,
              kind: 'NONE',
            };
          });
        }),
      );
  }

  getForeignColumns(
    connection: ISQLEConnection,
    foreignServer: string,
    schema: string,
    table: string,
  ): Observable<any[]> {
    const queryStr: string = `
      HELP FOREIGN TABLE "${schema}"."${table}"@${foreignServer};
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: { Column: string; Type: string }) => {
            return {
              name: row.Column,
              type: row.Type,
            };
          });
        }),
      );
  }

  getDatabases(connection: ISQLEConnection): Observable<any[]> {
    const queryStr: string =
      'SELECT databasename, PermSpace, SpoolSpace, TempSpace, CommentString, DBKind FROM dbc.databasesVX ORDER BY databasename;';
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: any) => {
            return {
              name: row.DatabaseName || row.schemaname,
              type: row.DBKind === 'U' ? 'user' : 'database',
              permSpace: row.PermSpace,
              spoolSpace: row.SpoolSpace,
              tempSpace: row.TempSpace,
              comment: row.CommentString,
            };
          });
        }),
      );
  }

  getDatabaseObjects(connection: ISQLEConnection, databaseId: string): Observable<any[]> {
    const queryStr: string = `SELECT DataBaseName, TableName, TableKind, CommentString FROM dbc.tablesvx
       WHERE TableKind in ('T', 'O', 'V') AND DataBaseName = '${databaseId}' ORDER BY TableName ASC;`;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: any) => {
            const type: string = row.TableKind || row.tablekind;
            return {
              kind: row.TableKind || row.tablekind,
              type: type === 'V' ? 'view' : 'table',
              name: row.TableName || row.tablename,
              database: row.DataBaseName || row.databasename,
              comment: row.CommentString,
            };
          });
        }),
      );
  }

  getTableColumns(type: string, connection: ISQLEConnection, databaseId: string, tableId: string): Observable<any> {
    if (type === 'table') {
      return this._queryService.getTableInfo(connection, databaseId, tableId).pipe(
        map((resultSet: any) => {
          return resultSet.columns.map((column: any) => {
            return {
              comment: column.remarks,
              type: 'column',
              columnType: column.type,
              name: column.name,
              database: resultSet.database,
              table: resultSet.name,
            };
          });
        }),
      );
    } else if (type === 'view') {
      return this._queryService.getViewInfo(connection, databaseId, tableId).pipe(
        map((resultSet: any) => {
          return resultSet.columns.map((column: any) => {
            return {
              comment: column.remarks,
              type: 'column',
              columnType: column.type,
              name: column.name,
              database: resultSet.database,
              table: resultSet.name,
            };
          });
        }),
      );
    }
  }

  search(
    connection: ISQLEConnection,
    searchStr: string,
    options: {
      databases: boolean;
      objects: boolean;
      columns: boolean;
    } = {
      databases: true,
      objects: true,
      columns: true,
    },
  ): Observable<any[]> {
    const queries: string[] = [];
    if (options.databases) {
      const dbQuery: string = `
        SELECT
            DatabaseName as objectName,
            'database' as objectType,
            DBKind as kind,
            CommentString
        FROM dbc.databasesvx
        WHERE DatabaseName LIKE '%${searchStr}%'
        AND DataBaseName NOT IN ('${sysDatabases.join("', '")}')
      `;
      queries.push(dbQuery);
    }
    if (options.objects) {
      const objectQuery: string = `
        SELECT
            DataBaseName || '~|~' || TableName as objectName,
            'object' as objectType,
            TableKind as kind,
            CommentString
        FROM dbc.tablesvx
        WHERE TableKind in ('T', 'O', 'V')
        AND TableName LIKE '%${searchStr}%'
        AND DataBaseName NOT IN ('${sysDatabases.join("', '")}')
      `;
      queries.push(objectQuery);
    }
    if (options.objects) {
      const columnQuery: string = `
        SELECT
            DataBaseName || '~|~' || TableName || '~|~' || ColumnName as objectName,
            'column' as objectType,
            ColumnType as kind,
            CommentString
        FROM dbc.columnsVX
        WHERE columnname LIKE '%${searchStr}%'
        AND DataBaseName NOT IN ('${sysDatabases.join("', '")}')
      `;
      queries.push(columnQuery);
    }
    const unionJoin: string = queries.join('UNION');
    const queryStr: string = `
      WITH quick_search AS (
          ${unionJoin}
      )
      SELECT * FROM quick_search
      ORDER BY 1
      SAMPLE 100;
    `;
    return this._queryService
      .querySystem(connection, {
        query: queryStr,
      })
      .pipe(
        map((resultSet: IQueryResultSet) => {
          return resultSet.results[0].data.map((row: any) => {
            let kind: string = row.kind;
            // map to proper type/kind
            if (row.objectType === 'column') {
              kind = 'column';
            } else if (row.objectType === 'database') {
              kind = kind === 'D' ? 'database' : 'user';
            } else {
              kind = kind === 'V' ? 'view' : 'table';
            }
            const newParent: string[] = [];
            // split name and parents..
            const nameSplit: string[] = row.objectName.split('~|~');
            for (let index: number = 0; index < nameSplit.length - 1; index++) {
              newParent.push('"' + nameSplit[index] + '"');
            }
            return {
              parent: newParent.join('.'),
              name: nameSplit[nameSplit.length - 1],
              kind,
              type: row.objectType,
              comment: row.CommentString,
            };
          });
        }),
      );
  }
}

export function VANTAGE_DICTIONARY_PROVIDER_FACTORY(
  parent: VantageDictionaryService,
  queryService: VantageQueryService,
): VantageDictionaryService {
  return parent || new VantageDictionaryService(queryService);
}

export const VANTAGE_DICTIONARY_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageDictionaryService,
  deps: [[new Optional(), new SkipSelf(), VantageDictionaryService], VantageQueryService],
  useFactory: VANTAGE_DICTIONARY_PROVIDER_FACTORY,
};
