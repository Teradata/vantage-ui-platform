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
      newTab: false,
    },

    {
      text: 'Console',
      href: 'http://teradata.com',
      icon: 'settings',
      newTab: true,
    },
  ];

  otherProducts: IVantageAppSwitcherItem[] = [
    {
      text: 'Jupyter',
      href: 'http://teradata.com',
      icon: 'settings',
      newTab: true,
    },
    {
      text: 'Something else',
      href: 'http://teradata.com',
      icon: 'settings',
    },
    {
      text: 'Another thing',
      href: 'http://teradata.com',
      icon: 'settings',
      newTab: false,
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

  toggleTheme($event: Event): void {
    this._themeService.toggleTheme();
  }

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
