import { Injectable, Provider, SkipSelf, Optional } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { TdDialogService, IAlertConfig, TdAlertDialogComponent } from '@covalent/core/dialogs';

import { TranslateService } from '@ngx-translate/core';

export class VantageError {
  message: string;
  error: number;
}

@Injectable()
export class VantageErrorService {

  constructor(private _dialogService: TdDialogService,
              private _translate: TranslateService) {}

  open(error: VantageError): MatDialogRef<TdAlertDialogComponent> {
    if (error) {
      let config: IAlertConfig = {
        title: this._translate.instant('THERE_WAS_A_PROBLEM'),
        message: error.message,
        disableClose: true,
        closeButton: this._translate.instant('CLOSE'),
      };
      if (error.error) {
        config.message += ` (${error.error.toString()})`;
      }
      if (config.message || config.title) {
        return this._dialogService.openAlert(config);
      }
    }
  }

}

export function VANTAGE_ERROR_PROVIDER_FACTORY(
  parent: VantageErrorService, dialogService: TdDialogService, translate: TranslateService): VantageErrorService {
  return parent || new VantageErrorService(dialogService, translate);
}

export const VANTAGE_ERROR_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageErrorService,
  deps: [[new Optional(), new SkipSelf(), VantageErrorService], TdDialogService, TranslateService],
  useFactory: VANTAGE_ERROR_PROVIDER_FACTORY,
};
