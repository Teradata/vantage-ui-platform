import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { MatDialogRef } from '@angular/material/dialog';

import { TdLoadingService } from '@covalent/core/loading';

import { ISystem, VantageSystemService } from '@td-vantage/ui-platform/system';
import { VantageConnectionService } from '../connection.service';
import { ISQLEConnection } from '../query.service';

import { Observable, Subject, of } from 'rxjs';
import { retry, map, tap, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vui-sqle-credentials-dialog',
  templateUrl: './credentials-dialog.component.html',
  styleUrls: ['./credentials-dialog.component.scss'],
})
export class VantageCredentialsDialogComponent implements OnInit, OnDestroy {
  // listens to times we try to connect regardless
  private _connectionAttempt$: Subject<void> = new Subject<void>();
  connectionAttempt$: Observable<void> = this._connectionAttempt$.asObservable();

  basicAuthEnabled: boolean = false;
  systems$: Observable<ISystem[]>;

  system: ISystem;
  connectionType: boolean = false;
  username: string;
  password: string;

  errorMsg: string;

  constructor(
    private _dialogRef: MatDialogRef<VantageCredentialsDialogComponent>,
    private _connectionService: VantageConnectionService,
    private _systemService: VantageSystemService,
    private _loadingService: TdLoadingService,
    private _translate: TranslateService,
  ) {}

  ngOnInit(): void {
    // prepopulate connection type
    this.connectionType = this.basicAuthEnabled;
    // prep systems observable
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('systemType', 'TERADATA');
    this.systems$ = this._systemService.query(queryParams).pipe(
      retry(2),
      catchError(() => {
        this.errorMsg = this._translate.instant('ERROR_RETRIEVE_DATA');
        return of({ data: [] });
      }),
      map((resp: { data: ISystem[] }) => resp.data),
      tap((systems: ISystem[]) => {
        if (systems && systems.length) {
          // select first system by default if no system was prepopulated
          if (!this.system) {
            this.system = systems[0];
          }
          // if there is only one system and basic auth disabled, we try to connect to it automagically
          if (systems.length === 1 && !this.basicAuthEnabled) {
            this.connect();
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    // finallize subject
    this._connectionAttempt$.complete();
  }

  compareSystemWith(a: ISystem, b: ISystem): boolean {
    return a && b && a.nickname === b.nickname;
  }

  async connect(): Promise<void> {
    try {
      this.errorMsg = undefined;
      // block users from closing the dialog while connecting
      this._dialogRef.disableClose = true;
      this._loadingService.register('system.connect');
      const connection: ISQLEConnection = this.connectionType
        ? { system: this.system, creds: btoa(this.username + ':' + this.password) }
        : { system: this.system };

      if (this._connectionService.connectionExits(connection)) {
        await this._connectionService.connectToExistingConnection(connection).toPromise();
      } else {
        await this._connectionService.addConnectionAndConnect(connection).toPromise();
      }

      this._dialogRef.close(connection);
    } catch (error) {
      this.errorMsg = error.message;
    } finally {
      this._connectionAttempt$.next();
      // allow users to close dialog again
      this._dialogRef.disableClose = false;
      this._loadingService.resolve('system.connect');
    }
  }

  cancel(): void {
    this._dialogRef.close();
  }
}
