import { ChangeDetectionStrategy, Component, Input, ElementRef } from '@angular/core';

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

  constructor(private elRef: ElementRef) {}

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleExpand(): void {
    const elem: HTMLElement = this.elRef.nativeElement.querySelector('.td-menu-content');
    elem.scrollTop = elem.scrollHeight;
  }
}
