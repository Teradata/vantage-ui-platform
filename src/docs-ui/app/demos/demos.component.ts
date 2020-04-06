import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VantageThemeService } from '@td-vantage/ui-platform/theme';
import { VantageCredentialsDialogComponent } from '@td-vantage/ui-platform/sqle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.scss'],
})
export class DemosComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  constructor(public _themeService: VantageThemeService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    // tslint:disable:no-console
    this._themeService
      .map({ 'dark-theme': 'dark-logo', 'light-theme': 'light-logo' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(console.log);
    this._themeService
      .map({ 'dark-theme': 'vision', 'light-theme': 2020 })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(console.log);
    this._themeService
      .map({ 'dark-theme': 'dark-logo' }, 'fallback')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(console.log);
    this._themeService.darkTheme$.pipe(takeUntil(this.unsubscribe)).subscribe(console.log);
    this._themeService.lightTheme$.pipe(takeUntil(this.unsubscribe)).subscribe(console.log);
    this._themeService.activeTheme$.pipe(takeUntil(this.unsubscribe)).subscribe(console.log);
    // tslint:enable:no-console
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  connect(basicAuthEnabled: boolean = false): void {
    const dialog: MatDialogRef<VantageCredentialsDialogComponent> = this._dialog.open(
      VantageCredentialsDialogComponent,
      {
        width: '500px',
      },
    );
    dialog.componentInstance.basicAuthEnabled = basicAuthEnabled;
  }
}
