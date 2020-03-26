import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';

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
  @Input() products: IVantageAppSwitcherItem[];
  @Input() otherProducts: IVantageAppSwitcherItem[];
  @Input() exploreMoreLink: string;

  constructor(public _themeService: VantageThemeService) {}

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
