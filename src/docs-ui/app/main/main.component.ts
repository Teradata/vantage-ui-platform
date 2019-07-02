import { Component, OnInit } from '@angular/core';

import { VantageToastService, VantageErrorService } from '@vantage/ui-platform/utilities';
import { VantageTokenService, VantageSessionService } from '@vantage/ui-platform/auth';
import { IUser } from '@vantage/ui-platform/user';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  user: IUser;

  constructor(private _errorService: VantageErrorService,
              private _toastService: VantageToastService,
              private _tokenService: VantageTokenService,
              private _sessionService: VantageSessionService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this._sessionService.getInfo().toPromise();
    } catch (error) {
      this._errorService.open(error.error);
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

  async logout(): Promise<void> {
    await this._sessionService.logout();
  }
}
