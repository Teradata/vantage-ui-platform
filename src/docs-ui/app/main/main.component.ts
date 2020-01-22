import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar) {}

  ngOnInit(): void {
    // Sets default theme to dark mode if user never set theme
    if (!this.activeTheme) {
      this.theme(this.DARK_THEME);
    }
  }

  get activeTheme(): string {
    return localStorage.getItem('vantage.theme');
  }
  theme(theme?: string): void {
    localStorage.setItem('vantage.theme', theme);
    document.getElementsByTagName('body').item(0).className = theme;
  }
}
