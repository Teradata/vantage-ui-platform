import { Injectable, Optional, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { VANTAGE_BASE_URL_TOKEN } from '@td-vantage/ui-platform/common';

export interface IVantageAppSwitcherItem {
  id?: string;
  text: string;
  description?: string;
  href: string;
  icon?: string;
  svgIcon?: string;
  iconClasses?: string[];
  divider?: boolean;
}

import { mixinHttp, TdGET } from '@covalent/http';

@Injectable({
  providedIn: 'root',
})
export class VantageProductsService extends mixinHttp(class {}, {
  baseUrl: '/assets',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
}) {
  get basePath(): string {
    return this._baseUrlOverride;
  }

  constructor(@Optional() @Inject(VANTAGE_BASE_URL_TOKEN) private _baseUrlOverride?: string) {
    super();
  }

  @TdGET({
    path: '/products.json',
  })
  get(): Observable<IVantageAppSwitcherItem[]> {
    return;
  }

  @TdGET({
    path: '/other-products.json',
  })
  getOther(): Observable<IVantageAppSwitcherItem[]> {
    return;
  }
}
