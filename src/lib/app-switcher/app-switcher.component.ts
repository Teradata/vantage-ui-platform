import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VantageThemeService } from '../theme/theme.service';

export interface IVantageAppSwitcherItem {
  text: string;
  href: string;
  icon?: string;
  svgIcon?: string;
  divider?: boolean;
}

@Component({
  selector: 'vui-app-switcher',
  templateUrl: './app-switcher.component.html',
  styleUrls: ['./app-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageAppSwitcherComponent {
  @Input() productList: IVantageAppSwitcherItem[];
  @Input() exploreMoreLink: string;

  constructor(public _themeService: VantageThemeService) {}
}
