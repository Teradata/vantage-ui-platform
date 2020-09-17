import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';
import { VantageSessionService } from '@td-vantage/ui-platform/auth';

@Component({
  selector: 'vui-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageUserProfileComponent {
  constructor(public themeService: VantageThemeService, public sessionService: VantageSessionService) {}
}
