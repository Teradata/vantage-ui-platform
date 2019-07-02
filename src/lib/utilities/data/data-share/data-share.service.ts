import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TdDataShareService<T = any> {

  private _subject: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);
  private _observable: Observable<T> = this._subject.asObservable();

  listen(): Observable<T> {
    return this._observable;
  }

  share(data: T): void {
    this._subject.next(data);
  }

}
