import { Component, OnInit, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IApp } from '..';

@Component({
  selector: 'app-app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class VantageAppIconComponent {
  private _app: IApp;
  _matListAvatar: boolean;
  @Input() color: string;

  @Input('matListAvatar')
  set matListAvatar(matListAvatar: boolean) {
    this._matListAvatar = coerceBooleanProperty(matListAvatar);
  }
  get active(): boolean {
    return this._matListAvatar;
  }

  @Input() set app(app: IApp) {
    this._app = app;
    if (this._app && this._app.icon) {
      this._app.isIconUrl = !!this.isUrl(this._app.icon);
    }
  }
  get app(): IApp {
    return this._app;
  }

  isUrl(path: string): boolean {
    try {
      return !!new URL(path);
    } catch (err) {
      return false;
    }
  }
}
