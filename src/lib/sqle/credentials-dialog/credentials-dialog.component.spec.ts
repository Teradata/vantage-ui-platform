import { Component } from '@angular/core';
import {
  TestBed,
  inject,
  async,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentMessageModule } from '@covalent/core/message';
import { CovalentHttpModule } from '@covalent/http';

import { VantageUserFeedbackModule } from '@td-vantage/ui-platform/utilities';

import { VantageSQLEModule } from '@td-vantage/ui-platform/sqle';
import { VantageSystemModule } from '@td-vantage/ui-platform/system';
import { VantageAuthenticationModule } from '@td-vantage/ui-platform/auth';

import { TranslateModule } from '@ngx-translate/core';

import { VantageCredentialsDialogComponent } from './credentials-dialog.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'connection-dialog-basic-component',
  template: `
    <div></div>
  `,
})
class ConnectionDialogBasicComponent {
  constructor(private _matDialog: MatDialog) {}

  connect(): MatDialogRef<VantageCredentialsDialogComponent> {
    return this._matDialog.open(VantageCredentialsDialogComponent, {
      width: '500px',
    });
  }
}

describe('Component: Credentials Dialog', () => {
  let overlayContainerElement: HTMLElement;

  let fixture: ComponentFixture<any>;
  let component: ConnectionDialogBasicComponent;
  let dialog: MatDialogRef<VantageCredentialsDialogComponent>;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        FormsModule,

        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,

        CovalentLoadingModule,
        CovalentMessageModule,
        CovalentHttpModule.forRoot(),

        VantageUserFeedbackModule,
        VantageSQLEModule,
        VantageSystemModule,
        VantageAuthenticationModule,

        TranslateModule.forRoot(),
      ],
      declarations: [VantageCredentialsDialogComponent, ConnectionDialogBasicComponent],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            overlayContainerElement.classList.add('cdk-overlay-container');

            document.body.appendChild(overlayContainerElement);

            // remove body padding to keep consistent cross-browser
            document.body.style.padding = '0';
            document.body.style.margin = '0';

            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ],
    });
    await TestBed.compileComponents();
  }));

  it('should render component and open dialog in empty state and then close dialog manually', (done: DoneFn) => {
    inject([HttpTestingController], async (httpTestingController: HttpTestingController) => {
      fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
      component = fixture.debugElement.componentInstance;
      dialog = component.connect();
      fixture.detectChanges();
      await fixture.whenStable();
      const req: TestRequest = httpTestingController.match(() => true)[0];
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual('/api/system/systems');
      expect(req.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
      req.flush([], {
        status: 200,
        statusText: 'OK',
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeFalsy();
      expect(overlayContainerElement.querySelector('#vui-credentials-dialog-username-input')).toBeFalsy();
      expect(overlayContainerElement.querySelector('#vui-credentials-dialog-password-input')).toBeFalsy();
      expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeTruthy();

      overlayContainerElement.querySelector('#vui-credentials-dialog-cancel-button').dispatchEvent(new Event('click'));
      fixture.detectChanges();
      await fixture.whenStable();
      done();
    })();
  });

  describe('BasicAuth: false', () => {
    it('should render component and open dialog with 1 system, try to connect automatically and then close dialog automatically', (done: DoneFn) => {
      inject([HttpTestingController], async (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        fixture.detectChanges();
        await fixture.whenStable();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        await fixture.whenStable();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('JWT');
        req2.flush(
          {},
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(overlayContainerElement.querySelector('vui-sqle-credentials-dialog')).toBeFalsy();
        done();
      })();
    });

    it('should render component and open dialog with 1 system, try to connect automatically and fail multiple times', fakeAsync(() => {
      inject([HttpTestingController], (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        fixture.detectChanges();
        tick();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('JWT');
        req2.error(
          new ErrorEvent('Something Failed', {
            message: 'error',
          }),
        );
        fixture.detectChanges();
        tick();
        const req3: TestRequest = httpTestingController.match(() => true)[0];
        req3.error(
          new ErrorEvent('Something Failed', {
            message: 'error',
          }),
        );
        fixture.detectChanges();
        tick();
        const req4: TestRequest = httpTestingController.match(() => true)[0];
        req4.flush({ message: 'error' }, { status: 400, statusText: 'Bad Request' });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-invalid-message')).toBeTruthy();
        dialog.close();
        fixture.detectChanges();
        tick(1000);
      })();
    }));

    it('should render component and open dialog with 2 systems, try to connect manually and then close dialog automatically', fakeAsync(() => {
      inject([HttpTestingController], (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        fixture.detectChanges();
        tick();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
            },
            {
              nickname: 'test2',
              host: 'www.test2.com',
              port: 1025,
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        overlayContainerElement
          .querySelector('#vui-credentials-dialog-connect-button')
          .dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('JWT');
        req2.flush(
          {},
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('vui-sqle-credentials-dialog')).toBeFalsy();
        tick(1000);
      })();
    }));

    it('should render component and open dialog with 2 systems, try to connect manually and fail', fakeAsync(() => {
      inject([HttpTestingController], (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        fixture.detectChanges();
        tick();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
            },
            {
              nickname: 'test2',
              host: 'www.test2.com',
              port: 1025,
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        overlayContainerElement
          .querySelector('#vui-credentials-dialog-connect-button')
          .dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('JWT');
        req2.flush(
          { message: 'Invalid creds' },
          {
            status: 420,
            statusText: 'Keep calm',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-invalid-message')).toBeTruthy();
        dialog.close();
        fixture.detectChanges();
        tick(1000);
      })();
    }));
  });

  describe('BasicAuth: true', () => {
    it('should render component and open dialog with 1 system, enter credentials, connect and close dialog automatically', fakeAsync(() => {
      inject([HttpTestingController], async (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        dialog.componentInstance.basicAuthEnabled = true;
        fixture.detectChanges();
        tick();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
              system_attributes: {
                attributes: {
                  log_mech: 'TD2',
                },
              },
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-connection-radio')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-username-input')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-password-input')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        fixture.detectChanges();
        tick();
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-username-input')
          .dispatchEvent(new Event('focus'));
        overlayContainerElement.querySelector<HTMLInputElement>('#vui-credentials-dialog-username-input').value =
          'user1';
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-username-input')
          .dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        overlayContainerElement
          .querySelector('#vui-credentials-dialog-password-input')
          .dispatchEvent(new Event('focus'));
        overlayContainerElement.querySelector<HTMLInputElement>('#vui-credentials-dialog-password-input').value =
          // tslint:disable-next-line:no-hardcoded-credentials
          'pass1234';
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-password-input')
          .dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        overlayContainerElement.querySelector<HTMLElement>('#vui-credentials-dialog-connect-button').click();
        fixture.detectChanges();
        tick();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('TD2');
        expect(req2.request.headers.get('X-Auth-Credentials')).toEqual('Basic ' + btoa('user1:pass1234'));
        req2.flush(
          {},
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('vui-sqle-credentials-dialog')).toBeFalsy();
        tick(1000);
      })();
    }));

    it('should render component and open dialog with 1 system, enter credentials, and fail to connect', fakeAsync(() => {
      inject([HttpTestingController], async (httpTestingController: HttpTestingController) => {
        fixture = TestBed.createComponent(ConnectionDialogBasicComponent);
        component = fixture.debugElement.componentInstance;
        dialog = component.connect();
        dialog.componentInstance.basicAuthEnabled = true;
        fixture.detectChanges();
        tick();
        const req1: TestRequest = httpTestingController.match(() => true)[0];
        expect(req1.request.method).toEqual('GET');
        expect(req1.request.url).toEqual('/api/system/systems');
        expect(req1.request.params.toString()).toEqual(new HttpParams().set('systemType', 'TERADATA').toString());
        req1.flush(
          [
            {
              nickname: 'test',
              host: 'www.test.com',
              port: 1025,
              system_attributes: {
                attributes: {
                  log_mech: 'TD2',
                },
              },
            },
          ],
          {
            status: 200,
            statusText: 'OK',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-system-select')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-connection-radio')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-username-input')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-password-input')).toBeTruthy();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-empty-state')).toBeFalsy();

        fixture.detectChanges();
        tick();
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-username-input')
          .dispatchEvent(new Event('focus'));
        overlayContainerElement.querySelector<HTMLInputElement>('#vui-credentials-dialog-username-input').value =
          'user1';
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-username-input')
          .dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick();
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-password-input')
          .dispatchEvent(new Event('focus'));

        overlayContainerElement.querySelector<HTMLInputElement>('#vui-credentials-dialog-password-input').value =
          // tslint:disable-next-line:no-hardcoded-credentials
          'pass1234';
        overlayContainerElement
          .querySelector('#vui-credentials-dialog-password-input')
          .dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        overlayContainerElement.querySelector<HTMLElement>('#vui-credentials-dialog-connect-button').click();
        fixture.detectChanges();
        tick();

        const req2: TestRequest = httpTestingController.match(() => true)[0];
        expect(req2.request.method).toEqual('POST');
        expect(req2.request.url).toEqual('/api/query/tdrest/systems/test/queries');
        expect(req2.request.body.logMech).toEqual('TD2');
        expect(req2.request.headers.get('X-Auth-Credentials')).toEqual('Basic ' + btoa('user1:pass1234'));
        req2.flush(
          { message: 'Invalid' },
          {
            status: 420,
            statusText: 'Keep Calm',
          },
        );
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.querySelector('#vui-credentials-dialog-invalid-message')).toBeTruthy();
        dialog.close();
        fixture.detectChanges();
        tick(1000);
      })();
    }));
  });
});
