import { Component, OnInit } from '@angular/core';

import { VantageToastService, VantageErrorService } from '@td-vantage/ui-platform/utilities';
import { VantageSessionService } from '@td-vantage/ui-platform/auth';
import { IUser } from '@td-vantage/ui-platform/user';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: IUser;
  loggedIn: boolean = false;

  constructor(
    private _errorService: VantageErrorService,
    private _toastService: VantageToastService,
    private _sessionService: VantageSessionService,
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
