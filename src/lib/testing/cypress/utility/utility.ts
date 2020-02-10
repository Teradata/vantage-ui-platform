/// <reference types="cypress" />

const BASE_URL: string = Cypress.config('baseUrl'); // ex: http://localhost:4200
const LOGIN_URL: string = Cypress.env('loginUrl'); // ex: https://vantage.url.io/auth

export interface ILoginCredentials {
  username: string;
  password: string;
}

// inspired by https://vrockai.github.io/blog/2017/10/28/cypress-keycloak-intregration/
export function login({ username, password }: ILoginCredentials): void {
  cy.request({
    url: LOGIN_URL,
  }).then((response: any) => {
    const loginPageHtml: HTMLElement = document.createElement('html');
    loginPageHtml.innerHTML = response.body;
    const loginForm: HTMLFormElement = loginPageHtml.querySelector('#kc-form-login');
    if (loginForm) {
      cy.request({
        form: true,
        method: 'POST',
        url: loginForm.action,
        followRedirect: false,
        body: {
          username,
          password,
        },
      }).then(() => {
        _redirectToHome();
      });
    } else {
      _redirectToHome();
    }
  });
}

export function logout(): void {
  cy.request('/api/user/logout');
}

function _redirectToHome(): void {
  cy.visit(BASE_URL);
  cy.url().should('not.include', LOGIN_URL);
  cy.url().should('include', BASE_URL);
}

export const SSO_COOKIES: string[] = ['USER_SSO_ID', 'XSRF-TOKEN'];
export function whiteListSSOCookies(): void {
  Cypress.Cookies.defaults({ whitelist: SSO_COOKIES });
}

export function waitForAngular(): Cypress.Chainable {
  cy.get('[ng-version]').should('exist');
  return cy.window().then((win: Window) => {
    return new Cypress.Promise(
      (resolve: (thenableOrResult?: {} | PromiseLike<{}>) => void, reject: (error?: any) => void) => {
        const testabilities: any = win['getAllAngularTestabilities']();
        if (!testabilities) {
          return reject(new Error('No testabilities. Is Angular loaded?'));
        }
        let count: number = testabilities.length;
        testabilities.forEach((testability: any) =>
          testability.whenStable(() => {
            count--;
            if (count !== 0) {
              return;
            }
            resolve();
          }),
        );
      },
    );
  });
}
