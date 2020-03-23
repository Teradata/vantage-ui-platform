import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
export class VantageAppSwitcherComponent implements OnInit {
  public activeTheme$: Observable<VantageTheme>;
  public appSwitcherLogo: string;
  public darkTheme: VantageTheme = VantageTheme.DARK;

  @Input() productList: IAppSwitcherItem[];
  @Input() exploreMoreLink: string;

  constructor(public _themeService: VantageThemeService) {}

  ngOnInit(): void {
    this.activeTheme$ = this._themeService.activeTheme$;
  }
}
