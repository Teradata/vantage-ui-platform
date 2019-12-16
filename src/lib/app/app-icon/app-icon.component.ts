import { Component, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IApp } from '../app.service';

@Component({
  selector: 'vui-app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class VantageAppIconComponent {
  private _matListAvatar: boolean = false;
  @Input() app: IApp;
  @Input() color: string;

  @Input('matListAvatar')
  set matListAvatar(matListAvatar: boolean) {
    this._matListAvatar = coerceBooleanProperty(matListAvatar);
  }
  get active(): boolean {
    return this._matListAvatar;
  }

  isUrl(path: string): boolean {
    try {
      return !!new URL(path);
    } catch (err) {
      return false;
    }
  }
}
