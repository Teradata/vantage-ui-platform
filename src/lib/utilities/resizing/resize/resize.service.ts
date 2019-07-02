import { Injectable, NgZone } from '@angular/core';

import { Subject, Observable, Subscription, fromEvent } from 'rxjs';

@Injectable()
export class TdResizeDispatcher {

  private _resizing: boolean = false;
  private _globalSubscription: Subscription;

  private _resizeSubject: Subject<void> = new Subject<void>();
  private _resizeObservable: Observable<void>;

  constructor(private _ngZone: NgZone) {
    this._resizeObservable = this._resizeSubject.asObservable();
    // we make sure that the resize checking happened outside of angular since it happens often
    this._globalSubscription = this._ngZone.runOutsideAngular(() => {
      return fromEvent(window, 'resize').subscribe(() => {
        // way to prevent the resize event from triggering the match media if there is already one event running already.
        if (!this._resizing) {
          this._resizing = true;
          setTimeout(() => {
            this._onResize();
            this._resizing = false;
          }, 100);
        }
      });
    });
  }

  listen(): Observable<void> {
    return this._resizeObservable;
  }

  private _onResize(): void {
    this._ngZone.run(() => {
      this._resizeSubject.next();
    });
  }

}
