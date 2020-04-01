import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IVantageAppSwitcherItem } from '../services/products.service';

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

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
