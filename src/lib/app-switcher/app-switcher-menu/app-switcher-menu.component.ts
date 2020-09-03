import { ChangeDetectionStrategy, Component, Input, ElementRef, ViewChild } from '@angular/core';

import { MatExpansionPanel } from '@angular/material/expansion';

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

  @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;

  constructor(private elRef: ElementRef) {}

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const elem: HTMLElement = this.elRef.nativeElement.querySelector('.td-menu-content');
      elem.scrollTop = elem.scrollHeight;
    });
  }
}
