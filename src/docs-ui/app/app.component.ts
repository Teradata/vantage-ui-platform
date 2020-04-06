import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { IVantageAppSwitcherItem } from '@td-vantage/ui-platform/app-switcher';
import { VantageThemeService, VantageTheme } from '../../lib/theme/theme.service';

@Component({
  selector: 'td-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  products: IVantageAppSwitcherItem[] = [
    {
      text: 'Vantage Launcher',
      href: 'http://teradata.com',
      svgIcon: 'td-logo:logo-mark',
      divider: true,
    },
    {
      text: 'Editor',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'Analyst',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'App Center',
      href: 'http://teradata.com',
    },

    {
      text: 'Console',
      href: 'http://teradata.com',
      icon: 'settings',
    },
  ];

  otherProducts: IVantageAppSwitcherItem[] = [
    {
      text: 'Jupyter',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'Something else',
      href: 'http://teradata.com',
      icon: 'settings',
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
