import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { IVantageAppSwitcherItem } from './services/products.service';
import { VantageAppSwitcherMenuComponent } from './app-switcher-menu/app-switcher-menu.component';

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
  @ViewChild('appSwitcherMenu', { static: true }) appSwitcherMenu: VantageAppSwitcherMenuComponent;

  menuClosed(): void {
    this.appSwitcherMenu.expansionPanel.close();
  }
}
