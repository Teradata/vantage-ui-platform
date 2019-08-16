/// <reference types="cypress" />

const BASE_URL: string = Cypress.config('baseUrl'); // ex: http://localhost:4200
const SSO_URL: string = Cypress.env('ssoUrl'); // ex: https://vantage.url.io/auth

export interface ISSOLoginConfig {
  username: string;
  password: string;
}

// inspired by https://vrockai.github.io/blog/2017/10/28/cypress-keycloak-intregration/
export function ssoLogin({ username, password }: ISSOLoginConfig): void {
  cy.visit(BASE_URL);
  cy.url().should('include', SSO_URL);
  cy.request({
    url: SSO_URL,
  }).then((response: any) => {
    const loginPageHtml: HTMLElement = document.createElement('html');
    loginPageHtml.innerHTML = response.body;
    const loginForm: HTMLFormElement = loginPageHtml.querySelector('#kc-form-login');
    if (!loginForm) {
      return;
    }
    cy.request({
      form: true,
      method: 'POST',
      url: loginForm.action,
      followRedirect: false,
      body: {
        username: username,
        password: password,
      },
    }).then(() => {
      cy.visit(BASE_URL);
      cy.url().should('not.include', SSO_URL);
      cy.url().should('include', BASE_URL);
    });
  });
}

export function ssoLogout(): void {
  cy.visit(BASE_URL);
  cy.visit('/api/user/logout');
  cy.visit(BASE_URL);
  cy.url().should('include', SSO_URL);
}
