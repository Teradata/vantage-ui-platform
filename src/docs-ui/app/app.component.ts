import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { IAppSwitcherItem } from '@td-vantage/ui-platform/app-switcher';
import { VantageThemeService, VantageTheme } from '../../lib/theme/theme.service';

@Component({
  selector: 'td-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  appSwitcherLogo: string = 'td-icons:teradata-dark';
  productList: IAppSwitcherItem[] = [
    {
      text: 'Vantage Launcher',
      href: 'http://teradata.com',
      icon: 'settings',
      divider: true,
    },
    {
      text: 'Console',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'App Center',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'Analyst',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'Explore more products',
      href: 'http://teradata.com',
      divider: true,
    },
  ];

  exploreMoreLink: string = 'http://teradata.com/products';

  constructor(
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    public _themeService: VantageThemeService,
  ) {
    // Register Covalent Icons
    this._iconRegistry.registerFontClassAlias('covalent', 'covalent-icons');

    // Register Teradata icons
    this._iconRegistry.addSvgIconSetInNamespace(
      'td-icons',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-icons.svg'),
    );

    // Register Teradata icons
    this._iconRegistry.addSvgIconSetInNamespace(
      'td-logo',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-logo.svg'),
    );
  }
}
