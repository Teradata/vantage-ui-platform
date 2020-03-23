import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VantageTheme, VantageThemeService } from '../theme/theme.service';

export interface IAppSwitcherItem {
  text: string;
  href: string;
  icon?: string;
  divider?: boolean;
}

@Component({
  selector: 'vui-app-switcher',
  templateUrl: './app-switcher.component.html',
  styleUrls: ['./app-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class VantageAppSwitcherComponent implements OnInit, OnDestroy {
  private serviceSubscription: Subscription;
  private appSwitcherLogo: string = 'td-logo:dark-theme';

  @Input() productList: IAppSwitcherItem[];
  @Input() exploreMoreLink: string;

  constructor(private _themeService: VantageThemeService) {}

  ngOnInit(): void {
    this.serviceSubscription = this._themeService.activeTheme$.subscribe((theme: VantageTheme) => {
      this.appSwitcherLogo = theme === VantageTheme.DARK ? 'td-logo:light-theme' : 'td-logo:dark-theme';
    });
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
