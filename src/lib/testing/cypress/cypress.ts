/// <reference types="cypress" />

export interface ISSOLoginConfig {
  username: string;
  password: string;
  baseUrl?: string; // ex: http://localhost:4200
  ssoUrl?: string; // ex: https://vantage.url.io/auth
}

// inspired by https://vrockai.github.io/blog/2017/10/28/cypress-keycloak-intregration/
export function ssoLogin({
  username,
  password,
  baseUrl = Cypress.config('baseUrl'),
  ssoUrl = Cypress.env('ssoUrl'),
}: ISSOLoginConfig): void {
  cy.visit(baseUrl);
  cy.url().should('include', ssoUrl);
  cy.request({
    url: ssoUrl,
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
      cy.visit(baseUrl);
      cy.url().should('not.include', ssoUrl);
      cy.url().should('include', baseUrl);
    });
  });
}

export interface ISSOLogoutConfig {
  baseUrl?: string; // ex: http://localhost:4200
  ssoUrl?: string; // ex: https://vantage.url.io/auth
}

export function ssoLogout({
  baseUrl = Cypress.config('baseUrl'),
  ssoUrl = Cypress.env('ssoUrl'),
}: ISSOLogoutConfig = {}): void {
  cy.visit(baseUrl);
  cy.visit('/api/user/logout');
  cy.visit(baseUrl);
  cy.url().should('include', ssoUrl);
}
