import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdMediaService } from '@covalent/core/media';

@Injectable()
export class VantageToastService {

  constructor(private _snackBarService: MatSnackBar,
              private _media: TdMediaService) { }

  open(message: string, time: number = 3000): void {
    if (message) {
      this._snackBarService.open(message, undefined, {
        duration: time,
        horizontalPosition: this._media && this._media.query('gt-sm') ? 'end' : 'center',
      });
    }
  }

}

export function VANTAGE_TOAST_PROVIDER_FACTORY(
  parent: VantageToastService, snackBar: MatSnackBar, media: TdMediaService): VantageToastService {
  return parent || new VantageToastService(snackBar, media);
}

export const VANTAGE_TOAST_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageToastService,
  deps: [[new Optional(), new SkipSelf(), VantageToastService], MatSnackBar, [new Optional(), TdMediaService]],
  useFactory: VANTAGE_TOAST_PROVIDER_FACTORY,
};
