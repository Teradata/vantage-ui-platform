import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { catchError, expand, map, mapTo, skipWhile, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { VantageConnectionService } from './connection.service';
import { VantageQueryService, IQueryPayload, IQueryResultSet } from './query.service';

interface ISpooledQueryError extends HttpErrorResponse {
  id: string;
  detailMessage: string;
}

const MAX_INTERVAL: number = 10000;
const BASE_INTERVAL: number = 2000;
const MAX_RETRIES: number = 2;

enum SpooledQueryState {
  QUEUED = 'QUEUED',
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  RESPONDING = 'RESPONDING',
  SPOOLING = 'SPOOLING',
  RESULT_SET_READY = 'RESULT_SET_READY',
}

export interface IRunningQueryInfo {
  id: string;
  sessionId: string;
}

@Injectable()
export class VantageSpooledQueryService {
  queryStatus: BehaviorSubject<SpooledQueryState> = new BehaviorSubject<SpooledQueryState>(undefined);
  queryStatus$: Observable<SpooledQueryState> = this.queryStatus.asObservable();
  queryStack: IRunningQueryInfo[] = [];
  constructor(
    private connectionService: VantageConnectionService,
    private queryService: VantageQueryService,
    private translate: TranslateService,
  ) {}

  cancelLastQuery(): void {
    const thisQuery: IRunningQueryInfo = this.queryStack.pop();

    return this.deleteSpooledQuery(thisQuery);
  }

  getRunningInfo(): Observable<SpooledQueryState> {
    return this.queryStatus$;
  }

  querySystem(payload: IQueryPayload): Observable<IQueryResultSet> {
    let currentRuns: number = 1;

    return this.queryService.querySystem(this.connectionService.current, { ...payload, spooledResultSet: true }).pipe(
      switchMap((res: any) => this.exponentialBackOffInterval(MAX_INTERVAL, res.id)),
      switchMap((id: number) =>
        this.queryService.getQuery(this.connectionService.current, id.toString()).pipe(
          map((query: any) => query.queryState),
          tap((val: any) => this.queryStatus.next(val)),
          map((val: any) => [id, val]),
        ),
      ),
      skipWhile(([id, status]: [string, SpooledQueryState]) => status !== SpooledQueryState.RESULT_SET_READY),
      take(1),
      switchMap(([id]: [string, SpooledQueryState]) =>
        this.queryService.getQueryResult(this.connectionService.current, id).pipe(
          map((val: IQueryResultSet) => [id, val]),
          catchError((res: HttpErrorResponse) => {
            if (
              res.error.message.includes(
                'The supplied statement could not be completed due to an internal error at a database worker node.  Please contact support at Teradata.',
              ) &&
              currentRuns <= MAX_RETRIES
            ) {
              currentRuns++;

              return this.querySystem(payload);
            }

            return throwError({
              ...res,
              ...{ id },
              detailMessage: `Error ${res.error.error}: ${res.error.message}`,
            } as ISpooledQueryError);
          }),
        ),
      ),
      map(([id, results]: [string, IQueryResultSet]) => results),
    );
  }

  exponentialBackOffInterval(maxInterval: number, returnVal: any): Observable<number> {
    return of(0).pipe(
      expand((iteration: number) => timer(this.calcInterval(iteration, maxInterval)).pipe(mapTo(iteration + 1))),
      mapTo(returnVal),
    );
  }

  calcInterval(iteration: number, maxInterval: number): number {
    const expo: number = 1.4;
    const interval: number = Math.pow(expo, iteration) * BASE_INTERVAL;

    return Math.min(interval, maxInterval);
  }

  deleteSpooledQuery(query: IRunningQueryInfo): void {
    this.queryService
      .deleteQuery(this.connectionService.current, query.id)
      .pipe(switchMap(() => this.queryService.deleteSession(this.connectionService.current, query.sessionId)))
      .subscribe(undefined, (err: Error) => {
        throw new Error(this.translate.instant('SPOOLED_QUERY_COULD_NOT_BE_DELETED', { error: JSON.stringify(err) }));
      });
  }
}

export function VANTAGE_SPOOLED_QUERY_PROVIDER_FACTORY(
  parent: VantageSpooledQueryService,
  connectionService: VantageConnectionService,
  queryService: VantageQueryService,
  translate: TranslateService,
): VantageSpooledQueryService {
  return parent || new VantageSpooledQueryService(connectionService, queryService, translate);
}

export const VANTAGE_SPOOLED_QUERY_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageSpooledQueryService,
  deps: [
    [new Optional(), new SkipSelf(), VantageSpooledQueryService],
    VantageConnectionService,
    VantageQueryService,
    TranslateService,
  ],
  useFactory: VANTAGE_SPOOLED_QUERY_PROVIDER_FACTORY,
};
