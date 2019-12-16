import { Component, OnInit } from '@angular/core';

import { VantageToastService, VantageErrorService } from '@td-vantage/ui-platform/utilities';
import { VantageSessionService } from '@td-vantage/ui-platform/auth';
import { IUser } from '@td-vantage/ui-platform/user';
import { timeout } from 'rxjs/operators';
import { IApp, VantageAppService } from '@td-vantage/ui-platform/app';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: IUser;
  loggedIn: boolean = false;
  apps: IApp[];

  constructor(
    private _errorService: VantageErrorService,
    private _toastService: VantageToastService,
    private _sessionService: VantageSessionService,
    private _appService: VantageAppService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this._sessionService
        .getInfo()
        .pipe(timeout(5000))
        .toPromise();
      this.loggedIn = true;
    } catch (error) {
      if (error.status !== 401) {
        this.loggedIn = false;
        this._errorService.open(error);
      }
    }

    const queryParam: HttpParams = new HttpParams();
    queryParam
      .append('page', '1')
      .append('per_page', '5')
      .append('sort', 'desc:last_updated_time');

    try {
      const response: { data: IApp[]; total: number } = await this._appService.query(queryParam).toPromise();
      this.apps = response.data;
      this.apps[0].icon = 'https://bitnami.com/assets/stacks/drupal/img/drupal-stack-220x234.png';
    } catch (error) {
      this._errorService.open(error);
    }
  }

  openToast(): void {
    this._toastService.open('My toast');
  }

  openDialog(): void {
    this._errorService.open({
      error: 1000,
      message: 'Error message',
    });
  }

  public logout(): void {
    this._sessionService.logout();
  }
}
