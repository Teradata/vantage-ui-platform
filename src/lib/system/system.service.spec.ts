import { TestBed, inject, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CovalentHttpModule, TdHttpService } from '@covalent/http';
import { Observable } from 'rxjs';

import { VantageSystemModule } from './system.module';
import { VantageSystemService, ISystem } from './system.service';

const testUrl: string = '/api/system';

describe('System Service:', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CovalentHttpModule.forRoot(), HttpClientTestingModule, VantageSystemModule],
    });
  }));

  it('expect to do a query succesfully', async(
    inject(
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.query().subscribe(
          (resp: { data: ISystem[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        service.query().subscribe(
          (data: { data: ISystem[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let queryParams: HttpParams = new HttpParams()
          .set('firstParam', '1')
          .set('second-Param', '2')
          .set('thirdParam', 'false');
        service.query(queryParams).subscribe(
          (resp: { data: ISystem[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service
          .query(<any>{
            firstParam: 1,
            secondParam: 2,
            thirdParam: false,
          })
          .subscribe(
            (resp: { data: ISystem[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.get('id-of-something').subscribe(
          (data: ISystem) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems/id-of-something');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let body: any = {};
        service.create(body).subscribe(
          (data: ISystem) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let body: any = {};
        service.update('id-of-something', body).subscribe(
          (data: ISystem) => {
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
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual(body);
        expect(req.request.url).toEqual(testUrl + '/systems/id-of-something');
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
      [VantageSystemService, HttpTestingController],
      (service: VantageSystemService, httpTestingController: HttpTestingController) => {
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
        expect(req.request.url).toEqual(testUrl + '/systems/id-of-something');
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
