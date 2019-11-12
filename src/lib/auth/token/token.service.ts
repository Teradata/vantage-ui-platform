import { Optional, SkipSelf, Provider } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TdHttp, TdPOST, TdBody, TdResponse } from '@covalent/http';

export interface IToken {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  token_type?: string;
  expires_in?: number;
  token_in?: string;
}

@TdHttp({
  baseUrl: '/api/user',
  baseHeaders: new HttpHeaders({ Accept: 'application/json' }),
})
export class VantageTokenService {
  @TdPOST({
    path: '/token',
    options: {
      observe: 'response',
    },
  })
  create(
    @TdBody() user: { username: string; password: string },
    @TdResponse() response?: Observable<HttpResponse<IToken>>,
  ): Observable<any> {
    return response.pipe(
      map((res: HttpResponse<IToken>) => {
        const data: IToken = res.body;
        const token: string = res.headers.get('X-AUTH-TOKEN') || data.access_token;
        return { data, token };
      }),
    );
  }
}

export function VANTAGE_TOKEN_PROVIDER_FACTORY(parent: VantageTokenService): VantageTokenService {
  return parent || new VantageTokenService();
}

export const VANTAGE_TOKEN_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: VantageTokenService,
  deps: [[new Optional(), new SkipSelf(), VantageTokenService]],
  useFactory: VANTAGE_TOKEN_PROVIDER_FACTORY,
};
