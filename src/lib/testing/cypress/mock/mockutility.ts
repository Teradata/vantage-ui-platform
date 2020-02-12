/// <reference types="cypress" />

declare global {
  // tslint:disable-next-line
  namespace Cypress {
    // tslint:disable-next-line
    interface Chainable {
      now(func: string, ...args: any[]): Chainable<Element>;
    }
  }
}

import { login, logout, ILoginCredentials, waitForAngular } from '../utility/utility';

import moment from 'moment';

export enum TestType {
  'unit' = 'unit',
  'e2e' = 'e2e',
}

enum Methods {
  'GET' = 'GET',
  'PUT' = 'PUT',
  'POST' = 'POST',
  'PATCH' = 'PATCH',
  'DELETE' = 'DELETE',
}

interface IRouteDef {
  url: string;
  method: string;
  status?: number;
  headers?: any;
  response?: any;
  onResponse?: any;
}

interface IFixtureRouteDef {
  alias?: string;
  status?: number;
  headers?: any;
  response?: any;
  onResponse?: any;
}

const allowedHeaders: string[] = ['content-type', 'x-length', 'x-page', 'x-total', 'x-total-pages'];

const PIPE: string = '|';
const SLASH: string = '/';

export class MockUtility {
  timestamp: string;
  recordedURLMethodFixtureMap: Map<string, Map<string, IFixtureRouteDef[]>>;
  urlMethodFixtureMap: Map<string, IFixtureRouteDef[]>;
  mocking: boolean = false;
  recording: boolean = false;
  testType: TestType;
  testName: string;

  /**
   * Method that handles all boilerplate work to set up test.
   *
   * @param testName testname used to determine existence of test specific fixtures and
   * @param testType unit or e2e
   * @param templates array of templates to be loaded (eg. 'empty' or 'golden')
   * @param userName user name matching fixture containing credentials
   * @param record force recording for this test, default is false
   */
  setUp(testName: string, testType: TestType, templates: string[], userName: string, record: boolean = false): void {
    cy.now('log', 'Test: ' + testName + SLASH + testType);
    this.testName = testName;
    this.testType = testType;

    // Start server to support routes
    cy.server();

    // Create timestamp and structures to retain fixture data
    this.timestamp = moment().format('LTS');
    this.urlMethodFixtureMap = new Map<string, IFixtureRouteDef[]>();
    this.recordedURLMethodFixtureMap = new Map<string, Map<string, IFixtureRouteDef[]>>();

    // Conditionally turn on recording
    if (Cypress.env('record') || record) {
      this.recording = true;

      cy.now('log', 'Recording...');
      cy.route({
        url: '**',
        method: 'GET',
        onResponse: (xhr: any) => {
          this.recordResponse(xhr);
        },
      });
      cy.route({
        url: '**',
        method: 'POST',
        onResponse: (xhr: any) => {
          this.recordResponse(xhr);
        },
      });
      cy.route({
        url: '**',
        method: 'PUT',
        onResponse: (xhr: any) => {
          this.recordResponse(xhr);
        },
      });
      cy.route({
        url: '**',
        method: 'PATCH',
        onResponse: (xhr: any) => {
          this.recordResponse(xhr);
        },
      });
      cy.route({
        url: '**',
        method: 'DELETE',
        onResponse: (xhr: any) => {
          this.recordResponse(xhr);
        },
      });
    }

    // Conditionally turn on mocking
    if (Cypress.env('mock') || testType === TestType.unit) {
      cy.now('log', 'Mocking...');
      this.mocking = true;
    }

    // Add routes for user logon
    if (this.mocking && !this.recording) {
      this.registerRoute(userName);
    }
    // Load template and test specific routes
    templates.forEach((template: string) => {
      this.registerRoute('templates/' + template);
      this.registerRoute('templates/' + template + SLASH + userName);
    });
    this.registerRoute('testspecific/' + testName);

    // Add new route command that alters its behavior based on mode.
    // If recording or production, just wait.
    // If mocking, allow returning mock results.
    Cypress.Commands.add('route2', (routeDef: IRouteDef) => {
      if (Cypress.env('mock')) {
        cy.now('log', 'Setting route to mock');
        cy.route(routeDef);
      } else {
        cy.now('log', ' Setting route to alias');
        cy.route(routeDef.url);
      }
    });

    cy.route({
      method: 'GET',
      url: '/api/user/logout',
      status: 200,
      response: {},
    });

    // Handle login based on mode.
    // Mock, bypass login
    // Otherwise, log in using credentials from fixture.
    if (this.mocking && !this.recording) {
      cy.visit('/');
    } else {
      cy.fixture('credentials/' + userName).then((credentials: ILoginCredentials) => {
        login(credentials);
      });
    }

    // Wait for page to load
    waitForAngular();
  }

  /**
   * Discover any mock data fixtures under the specified directory hierarchy
   * and register associated cy.routes.
   *
   * @param filename fixture filename
   */
  registerRoute(dir: string): void {
    // Check to see if the file exists.
    const mockDataFile: string = dir + '/mockdata.json';
    cy.exec('if [ -f cypress/fixtures/' + mockDataFile + ' ]; then ls cypress/fixtures/' + mockDataFile + '; fi').then(
      (results: any) => {
        if (!results.stdout) {
          return;
        }
        cy.fixture(mockDataFile).then((byURLRoutesMap: Map<string, Map<string, IFixtureRouteDef[]>>) => {
          // Iterate through file processing URL/method mappings
          // File is a map with URL as the key. Values are maps
          // in turn, where each map has method as the key value.
          // The value of these internal maps is an array of responses.
          Object.keys(byURLRoutesMap).forEach((url: string) => {
            const byMethodRoutesMap: Map<string, IFixtureRouteDef[]> = byURLRoutesMap[url];
            Object.keys(byMethodRoutesMap).forEach((method: string) => {
              const fixtureRouteDefs: IFixtureRouteDef[] = byMethodRoutesMap[method];
              const urlMethodKey: string = url + PIPE + method;
              let firstRouteDef: boolean = false;
              fixtureRouteDefs.forEach((fixtureRouteDef: IFixtureRouteDef) => {
                // Known mocks supercede recording
                if (this.mocking) {
                  if (this.urlMethodFixtureMap.get(urlMethodKey) === undefined) {
                    this.urlMethodFixtureMap.set(urlMethodKey, []);
                    firstRouteDef = true;
                  }
                  this.urlMethodFixtureMap.get(urlMethodKey).push(fixtureRouteDef);

                  if (firstRouteDef) {
                    this.registerMockRoute(url, method, fixtureRouteDef);
                  }
                } else if (this.recording) {
                  // onResponse records XHR response
                  const routeDef: IRouteDef = {
                    method,
                    url,
                    onResponse: (xhr: any) => {
                      this.recordResponse(xhr);
                    },
                  };

                  cy.now('log', 'Registering recording route:');
                  cy.now('log', 'url/method: ' + url + SLASH + method);
                  cy.route(routeDef).as(fixtureRouteDef.alias);
                } else {
                  const routeDef: IRouteDef = {
                    method,
                    url,
                  };

                  cy.now('log', 'Registering alias route:');
                  cy.now('log', 'url/method: ' + url + SLASH + method);
                  cy.now('log', 'alias: ' + fixtureRouteDef.alias);
                  cy.route(routeDef).as(fixtureRouteDef.alias);
                }
              });
            });
          });
        });
      },
    );
  }

  registerMockRoute(url: string, method: string, fixtureRouteDef: IFixtureRouteDef): void {
    const routeDef: IRouteDef = {
      url,
      method,
      status: fixtureRouteDef.status,
      headers: fixtureRouteDef.headers,
      response: fixtureRouteDef.response,
      onResponse: (xhr: any) => {
        const responseURL: URL = new URL(xhr.url);
        const responseKey: string = responseURL.pathname + PIPE + xhr.method;
        const fixtureRouteDefs: IFixtureRouteDef[] = this.urlMethodFixtureMap.get(responseKey);
        // If more routes exist, shift old fixture, and re-assign
        if (fixtureRouteDefs.length > 1) {
          fixtureRouteDefs.shift();
          const updatedFixtureRouteDef: IFixtureRouteDef = fixtureRouteDefs[0];
          this.registerMockRoute(url, method, updatedFixtureRouteDef);
        }
      },
    };

    cy.now('log', 'Registering mock route:');
    cy.now('log', 'url/method: ' + url + SLASH + method);
    cy.now('log', 'alias: ' + fixtureRouteDef.alias);
    cy.now('log', 'status: ' + fixtureRouteDef.status);
    cy.now('log', 'headers: ' + JSON.stringify(fixtureRouteDef.headers));
    cy.now('log', 'response: ' + JSON.stringify(fixtureRouteDef.response));
    cy.route(routeDef).as(fixtureRouteDef.alias);
  }

  recordResponse(xhr: any): void {
    // Manipulate URL value to strip host info
    const url: string = xhr.url.substring(Cypress.config('baseUrl').length);
    const method: string = xhr.method;

    // Remove black listed headers
    const headers: any = {};
    Object.keys(xhr.response.headers).forEach((key: string) => {
      if (allowedHeaders.indexOf(key) !== -1) {
        headers[key] = xhr.response.headers[key];
      }
    });

    const fixtureRouteDef: IFixtureRouteDef = {
      alias: url + PIPE + method,
      status: xhr.status,
      headers,
      response: xhr.response.body,
    };

    if (!this.recordedURLMethodFixtureMap[url]) {
      this.recordedURLMethodFixtureMap[url] = {};
    }
    const byMethodMap: Map<string, IFixtureRouteDef[]> = this.recordedURLMethodFixtureMap[url];
    if (!byMethodMap[method]) {
      byMethodMap[method] = [];
    }
    cy.now('log', 'Recording response:');
    cy.now('log', 'url/method: ' + url + SLASH + method);
    cy.now('log', 'response: ' + JSON.stringify(fixtureRouteDef));
    byMethodMap[method].push(fixtureRouteDef);
  }

  tearDown(): void {
    if (this.recording) {
      cy.now(
        'log',
        'Writing record fixture: ' + 'cypress/recordings/' + this.testName + SLASH + this.timestamp + '/mockdata.json',
      );
      cy.now(
        'writeFile',
        'cypress/recordings/' + this.testName + SLASH + this.timestamp + '/mockdata.json',
        this.recordedURLMethodFixtureMap,
      );
    }
    if (!this.mocking) {
      logout();
    }
  }
}
