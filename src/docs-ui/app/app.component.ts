import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'td-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _iconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer) {
    // Register Covalent Icons
    this._iconRegistry.registerFontClassAlias('covalent', 'covalent-icons');

    // Register Teradata icons
    this._iconRegistry.addSvgIconSetInNamespace(
      'td-icons',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-icons.svg'),
    );
  }
}
