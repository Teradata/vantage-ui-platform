import { Injectable, Renderer2, Inject, RendererFactory2, Provider, Optional, SkipSelf } from '@angular/core';
import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

const THEME_LOCAL_STORAGE_KEY: string = 'vantage.theme';

export enum VantageTheme {
  DARK = 'dark-theme',
  LIGHT = 'light-theme',
}

@Injectable()
export class VantageThemeService {
  private _renderer2: Renderer2;

  private readonly _activeThemeSubject: BehaviorSubject<VantageTheme> = new BehaviorSubject<VantageTheme>(
    <VantageTheme>localStorage.getItem(THEME_LOCAL_STORAGE_KEY),
  );
  readonly activeTheme$: Observable<VantageTheme> = this._activeThemeSubject.asObservable();
  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private _document: any) {
    this._renderer2 = rendererFactory.createRenderer(undefined, undefined);
    fromEvent(window, 'storage')
      .pipe(filter((event: StorageEvent) => event.key === THEME_LOCAL_STORAGE_KEY))
      .subscribe((event: StorageEvent) => this.applyTheme(<VantageTheme>event.newValue));
  }

  private get activeTheme(): VantageTheme {
    return this._activeThemeSubject.getValue();
  }

  private set activeTheme(theme: VantageTheme) {
    this._activeThemeSubject.next(theme);
  }

  public get darkThemeIsActive(): boolean {
    return this.activeTheme === VantageTheme.DARK;
  }
  public get lightThemeIsActive(): boolean {
    return this.activeTheme === VantageTheme.LIGHT;
  }

  public applyLightTheme(): void {
    this.applyTheme(VantageTheme.LIGHT);
  }

  public applyDarkTheme(): void {
    this.applyTheme(VantageTheme.DARK);
  }

  public toggleTheme(): void {
    this.activeTheme === VantageTheme.DARK ? this.applyLightTheme() : this.applyDarkTheme();
  }

  private applyTheme(theme: VantageTheme): void {
    this._renderer2.removeClass(
      this._document.querySelector('html'),
      theme === VantageTheme.DARK ? VantageTheme.LIGHT : VantageTheme.DARK,
    );
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
    this._renderer2.addClass(this._document.querySelector('html'), theme);
    this.activeTheme = <VantageTheme>localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
  }
}

export function VANTAGE_THEME_PROVIDER_FACTORY(
  parent: VantageThemeService,
  rendererFactory: RendererFactory2,
  _document: any,
): VantageThemeService {
  return parent || new VantageThemeService(rendererFactory, _document);
}

export const VANTAGE_THEME_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageThemeService,
  deps: [[new Optional(), new SkipSelf(), VantageThemeService], [RendererFactory2], [DOCUMENT]],
  useFactory: VANTAGE_THEME_PROVIDER_FACTORY,
};
