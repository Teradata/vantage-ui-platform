import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  navLinks: any = [
    {
      name: 'Material Components',
      route: '/mat-components',
    },
    {
      name: 'Typography',
      route: '/typography',
    },
    {
      name: 'Teradata Icons',
      route: '/icons',
    },
    {
      name: 'Demos',
      route: '/demos',
    },
    {
      name: 'Covalent',
      route: '/covalent-components',
    },
  ];

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar, public _themeService: VantageThemeService) {}
}
