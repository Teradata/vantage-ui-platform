import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CovalentHttpModule } from '@covalent/http';

import { VantageAppModule } from './app.module';
import { VantageAppsService, IApp } from './apps.service';

const testUrl: string = '/api/app';

describe('App Service:', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CovalentHttpModule.forRoot(), HttpClientTestingModule, VantageAppModule],
    });
  }));

  it('expect to do a query succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.query().subscribe(
          (resp: { data: IApp[]; total: number }) => {
            expect(resp.data.length).toBe(0);
            expect(resp.total).toBe(0);
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(testUrl + '/apps');
        req.flush([], {
          status: 200,
          statusText: 'OK',
          headers: { 'X-Total': '0' },
        });
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do a query failure', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        service.query().subscribe(
          (data: { data: IApp[]; total: number }) => {
            fail('on success execute when it shouldnt have with observables');
          },
          (err: HttpErrorResponse) => {
            expect(err.error.message).toBe('error', 'on error didnt execute with observables');
          },
          () => {
            fail('on complete execute when it shouldnt have with observables');
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(testUrl + '/apps');
        req.error(
          new ErrorEvent('Something Failed', {
            message: 'error',
          }),
        );
        httpTestingController.verify();
      },
    ),
  ));

  it('expect to do a query with HttpParams parameters succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let queryParams: HttpParams = new HttpParams()
          .set('firstParam', '1')
          .set('second-Param', '2')
          .set('thirdParam', 'false');
        service.query(queryParams).subscribe(
          (resp: { data: IApp[]; total: number }) => {
            expect(resp.data.length).toBe(0);
            expect(resp.total).toBe(0);
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('GET');
        expect(req.request.params).toEqual(queryParams);
        expect(req.request.url).toEqual(testUrl + '/apps');
        req.flush([], {
          status: 200,
          statusText: 'OK',
          headers: { 'X-Total': '0' },
        });
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do a query with object parameters succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service
          .query(<any>{
            firstParam: 1,
            secondParam: 2,
            thirdParam: false,
          })
          .subscribe(
            (resp: { data: IApp[]; total: number }) => {
              expect(resp.data.length).toBe(0);
              expect(resp.total).toBe(0);
              success = true;
            },
            () => {
              fail('on error executed when it shouldnt have with observables');
            },
            () => {
              complete = true;
            },
          );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.toString()).toEqual('firstParam=1&secondParam=2&thirdParam=false');
        expect(req.request.url).toEqual(testUrl + '/apps');
        req.flush([], {
          status: 200,
          statusText: 'OK',
          headers: { 'X-Total': '0' },
        });
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do a get succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.get('id-of-something').subscribe(
          (data: IApp) => {
            expect(data).toBeTruthy();
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(testUrl + '/apps/id-of-something');
        req.flush(
          {},
          {
            status: 200,
            statusText: 'OK',
          },
        );
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do a create succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let body: any = {};
        service.create(body).subscribe(
          (data: IApp) => {
            expect(data).toBeTruthy();
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(body);
        expect(req.request.url).toEqual(testUrl + '/apps');
        req.flush(
          {},
          {
            status: 200,
            statusText: 'OK',
          },
        );
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do an update succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let body: any = {};
        service.update('id-of-something', body).subscribe(
          (data: IApp) => {
            expect(data).toBeTruthy();
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('PATCH');
        expect(req.request.body).toEqual(body);
        expect(req.request.url).toEqual(testUrl + '/apps/id-of-something');
        req.flush('success', {
          status: 200,
          statusText: 'OK',
        });
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));

  it('expect to do an delete succesfully', async(
    inject(
      [VantageAppsService, HttpTestingController],
      (service: VantageAppsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.delete('id-of-something').subscribe(
          () => {
            success = true;
          },
          () => {
            fail('on error executed when it shouldnt have with observables');
          },
          () => {
            complete = true;
          },
        );

        let req: TestRequest = httpTestingController.match(() => true)[0];
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.url).toEqual(testUrl + '/apps/id-of-something');
        req.flush('success', {
          status: 200,
          statusText: 'OK',
        });
        httpTestingController.verify();

        expect(success).toBe(true, 'on success didnt execute with observables');
        expect(complete).toBe(true, 'on complete didnt execute with observables');
      },
    ),
  ));
});
