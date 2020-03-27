import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IVantageAppSwitcherItem } from './app-switcher-menu/app-switcher-menu.component';

@Component({
  selector: 'vui-app-switcher',
  templateUrl: './app-switcher.component.html',
  styleUrls: ['./app-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageAppSwitcherComponent {
  @Input() productList: IVantageAppSwitcherItem[];
  @Input() exploreMoreLink: string;
}
