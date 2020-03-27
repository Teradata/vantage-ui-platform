import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';

export interface IVantageAppSwitcherItem {
  text: string;
  href: string;
  icon?: string;
  svgIcon?: string;
  iconClasses?: string[];
  divider?: boolean;
}

@Component({
  selector: 'vui-app-switcher-menu',
  templateUrl: './app-switcher-menu.component.html',
  styleUrls: ['./app-switcher-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageAppSwitcherMenuComponent {
  @Input() products: IVantageAppSwitcherItem[];
  @Input() otherProducts: IVantageAppSwitcherItem[];
  @Input() exploreMoreLink: string;

  constructor(public _themeService: VantageThemeService) {}

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
