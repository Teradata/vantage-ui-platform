import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
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
      name: 'Demos',
      route: '/demos',
    },
  ];

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar, public _themeService: VantageThemeService) {}
}
