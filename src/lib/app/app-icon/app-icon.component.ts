import { Component, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IApp } from '../app.service';

@Component({
  selector: 'vt-app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class VantageAppIconComponent {
  @Input() app: IApp;
  @Input() color: string;

  @Input() matListAvatar: boolean;

  get avatar(): boolean {
    return coerceBooleanProperty(this.matListAvatar);
  }

  isUrl(path: string): boolean {
    try {
      return !!new URL(path);
    } catch (err) {
      return false;
    }
  }
}
