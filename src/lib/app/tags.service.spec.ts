import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CovalentHttpModule } from '@covalent/http';

import { VantageAppModule } from './app.module';
import { VantageTagsService, ITag } from './tags.service';

const testUrl: string = '/api/app';

describe('Tags Service:', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CovalentHttpModule.forRoot(), HttpClientTestingModule, VantageAppModule],
    });
  }));

  it('expect to do a query succesfully', async(
    inject(
      [VantageTagsService, HttpTestingController],
      (service: VantageTagsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service.query().subscribe(
          (resp: { data: ITag[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/tags');
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
      [VantageTagsService, HttpTestingController],
      (service: VantageTagsService, httpTestingController: HttpTestingController) => {
        service.query().subscribe(
          (data: { data: ITag[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/tags');
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
      [VantageTagsService, HttpTestingController],
      (service: VantageTagsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        let queryParams: HttpParams = new HttpParams()
          .set('firstParam', '1')
          .set('second-Param', '2')
          .set('thirdParam', 'false');
        service.query(queryParams).subscribe(
          (resp: { data: ITag[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/tags');
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
      [VantageTagsService, HttpTestingController],
      (service: VantageTagsService, httpTestingController: HttpTestingController) => {
        let success: boolean = false;
        let complete: boolean = false;
        service
          .query(<any>{
            firstParam: 1,
            secondParam: 2,
            thirdParam: false,
          })
          .subscribe(
            (resp: { data: ITag[]; total: number }) => {
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
        expect(req.request.url).toEqual(testUrl + '/tags');
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
});
