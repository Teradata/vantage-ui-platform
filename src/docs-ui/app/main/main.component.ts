import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VantageThemeService } from '../../../lib';

@Component({
  selector: 'td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  DARK_THEME: string = 'dark-theme';
  LIGHT_THEME: string = 'light-theme';

  isDarkTheme = false;

  navLinks: any = [
    {
      name: 'Components',
      route: '/components',
    },
    {
      name: 'Typography',
      route: '/typography',
    },
  ];

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar, private _themeService: VantageThemeService) {}

  ngOnInit(): void {
    // Sets default theme to dark mode if user never set theme
  }

  get darkThemeIsActive(): boolean {
    return this._themeService.darkThemeIsActive;
  }
  get lightThemeIsActive(): boolean {
    return this._themeService.lightThemeIsActive;
  }

  applyLightTheme(): void {
    this._themeService.applyLightTheme();
  }
  applyDarkTheme(): void {
    this._themeService.applyDarkTheme();
  }
}
