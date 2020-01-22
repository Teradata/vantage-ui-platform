# Cypress Testing Utilities

## Login and logout

Functions to help facilitate logging in and out

- `login()`
- `logout()`

### Setup

- `baseUrl`

  - must be defined in the cypress config (cypress.json)
  - ex: http://localhost:4200

- `loginUrl`
  - must be defined in the cypress env config (cypress.env.json)
  - ex: https://vantage.url.io/auth

### Usage

```typescript
import { login, logout } from '@td-vantage/ui-platform/testing/cypress';

login({
  username: 'username',
  password: 'password',
});

logout();
```

## Whitelisting SSO Cookies

Cypress deletes cookies between each `it`. This whitelists the sso cookies, so they are not deleted.

### Usage

`support/index.js`

```js
import { whiteListSSOCookies } from '@td-vantage/ui-platform/testing/cypress';

whiteListSSOCookies();
```

Or if you want more control just import the SSOCookies

```js
import { SSO_COOKIES } from '@td-vantage/ui-platform/testing/cypress';

Cypress.Cookies.defaults({ whitelist: [..SSO_COOKIES, 'my-custom-cookie'] });
```

## Waiting for Angular

Wait for Angular to stabilize

### Usage

```ts
import { waitForAngular } from '@td-vantage/ui-platform/testing/cypress';

waitForAngular();
```

# MockUtility And Data Mocking Framework

A mock utility class is provided to support automatically registering routes from fixture files. It also
supports the automatic gathering of response data into fixture files (called recording).

## Test Types

The mock utility supports two types of tests.

- Unit: always driven off of mocked data. Generally used to test finite behavior of a specific component.
- E2E: can be driven off of mock, real or a combination of mock and real data. Used to test flows through the UI.
  Tests should be written in such a way that they are flexible in their handling of UI content (eg. by inspecting
  and reacting to response data).

## Test Directory Hierarchy

The following Cypress sub-directory hierarchy is assumed by the MockUtility.

- fixtures: JSON files used to define content including user credentials and mock response data.
- integration: root of test spec directory hierarcy
- recordings: location where response data is recorded if recording is enabled
- support: where utility functions reside

## Mocking

Mocking is supported for all test types. There are two approaches to mocking:

- Allow the test framework to introduce `cy.route` statements based on the presence of fixtures
  requested within the _cypress/fixtures/templates_ directory hierarchy
- Using `cy.route` statements in-line in your test code

Mock files are named _mockdata.json_.

### Fixture Content

A _mockdata.json_ fixture file has the following general format:

{
urlWithQueryParams: {
method: [
{
alias: aliasStr,
status: number,
headers: {
content-type: type,
x-length: number,
...
},
response: <some object>
},
...
],
method: [
...
]
},
urlWithQueryParams: {
...
},
...
}

For example, the "empty" state fixture _cypress/fixtures/templates/mockdata.json_ has the following content.
This fixture returns "empty" response data for all requests invoked to populate the homepage.

{
"/api/app/apps?favorite=true&type=sql": {
"GET": [
{
"alias": "/api/app/apps?favorite=true&type=sql|GET",
"status": 200,
"headers": {
"content-type": "application/json",
"x-length": "0",
"x-page": "0",
"x-total": "0",
"x-total-pages": "0"
},
"response": [ ]
}
]
},
"/api/app/apps?page=1&per_page=5&type=sql&access=OWNER&sort=desc:last_updated_time": {
"GET": [
{
"alias": "/api/app/apps?page=1&per_page=5&type=sql&access=OWNER&sort=desc:last_updated_time|GET",
"status": 200,
"headers": {
"content-type": "application/json",
"x-length": "0",
"x-page": "0",
"x-total": "0",
"x-total-pages": "0"
},
"response": [ ]
}
]
},
...
}

For each URL/method pair, you can define multiple responses. Each response is defined to have an alias
(useful in your code to perform cy.wait()), a status, headers and some response body content. The infrastructure
"re-plays" these registered responses in the order that they are defined in the fixture. That is, if you have
defined three responses for a particular URL/method pair, on the first request for this URL/method the first
response will be returned. On the second request the second response will be returned. On the third and any
subsequent requests, the third response will be returned.

### Fixture Hierarchy

The fixture directory is organized as follows:

- credentials: user credentials (eg. user1, root)
- templates > _templatename_ > mockdata.json: broadly describes backend environment
- testspecific > mockdata.json: test specific responses to alter backend environment
- _username_ > mockdata.json: fixture for mocking login protocol for specific user

Your project should construct a directory hierachy conforming to this directory layout.

### Order of Fixture Application

The following fixture application order is enforced.

_username_ > mockdata.json
templates > _templatename_ > mockdata.json
testspecific > mockdata.json

## Why Order of Fixture Application Matters

The Cypress route command allows test writers to identify when a particular URL/method combination has occurred
and optionally manipulate the response status, headers and/or results body.

One thing to keep in mind when working with routes is that Cypress only allows a single route definition to apply
to a particular method/URL combination. So the order in which you define routes is important if URL/method values
conflict.

Consider the following scenarios:

#### Exact Match Supersedes Wildcard

```javascript
// A wildcard route
cy.route({
  url: '/**',
  response: { key: 'value1' },
});

// A specific route
cy.route({
  method: 'GET',
  url: '/foo/bar',
  response: { key: 'value2' },
});
```

Any request that exactly matches "/foo/bar" GET will receive stubbed response object `{ key: 'value2' }`. All other
requests will receive stubbed response object `{ key: 'value1' }`.

#### Wildcard Supersedes Exact Match

```javascript
// A specific route
cy.route({
  method: 'GET',
  url: '/foo/bar',
  response: { key: 'value1' },
});

// A wildcard route
cy.route({
  url: '/**',
  response: { key: 'value2' },
});
```

You might think that specifying a specific URL/method combination prior to defining the "wildcard" stub would result
in Cypress stubbing "/foo/bar" GET and returning response object `{ key: 'value1' }`. However, from Cypress' perspective
you have "re-defined" stubbing on the subsequent cy.route(). Cypress will match requests to the wildcard, resulting in
response object `{ key: 'value2' }` being returned.

#### Re-assignment

```javascript
// Return value1
cy.route({
  url: '/foo/bar',
  response: { key: 'value1' }
});

....

// Re-assign to return value2
cy.route({
  method: 'GET',
  url: '/foo/bar',
  response: { key: 'value2' }
});
```

Again, from Cypress' perspective you have "re-defined" stubbing on the subsequent cy.route(). `{ key: 'value2' }` will be
returned.

## Test Development

### Helper Methods

There are two utility methods that all tests should utilize. These methods must be invoked before and after each it().
If your spec has a single it(), you can call the methods at the beginning and end of the it() or within the before()/after()
or beforeEach()/afterEach() methods. However, if your spec contains multiple its(), either call the methods at the beginning
and end of each it() or within beforeEach()/afterEach().

- mockUtil.setUp(_testname_: string, _testtype_: string, _templates_: string[], _username_: string, _record_: boolean):
  Parameters have the following effect.

  - _testname_ - used for finding test specific fixtures and determining the output directory when recording fixtures.
  - _testtype_ - the primary control for enforcing the use of mock data. If type is _unit_, then
    mock data will be used. If type is _e2e_, mock data will be used conditionally based on the existence
    of the environment variable _mock_ in the Cypress environment.
  - _templates_ - a list of one or more template fixtures to be conditionally loaded as response data and/or as aliases based
    on the mocking rules above.
  - _record_ - boolean which allows developers to force recording for the current test.

  Once the parameters are interpreted, setUp invokes `cy.server()`. If response recording is enabled, a wildcard route is registered
  that will record the response XHR (sanitized) to an internal data structure, mapped by URL/method. If mocking is to be performed,
  it then loads fixtures in the order specified above. If mocking data, and hence mocking login, this method visits '/' to kick off
  the test. Otherwise, it performs the single sign-on login.

- tearDown(): If recording, this method dumps the URL/method to response data map to a _mockdata.json_ file in the
  _cypress/recordings/testname/date_ directory. It then logs the user out.

#### Usage

Defining an E2E test

```javascript
import { MockUtility, TestType } from '@td-vantage/ui-platform/testing/cypress';

describe('E2E Test', () => {
  const mockUtil: MockUtility = new MockUtility();

  before(() => {
    mockUtil.setUp('mye2etest', TestType.e2e, ['golden'], 'user1');
  });
```

Defining a unit test

```javascript
import { MockUtility, TestType } from '@td-vantage/ui-platform/testing/cypress';

describe('Unit Test', () => {
  const mockUtil: MockUtility = new MockUtility();

  before(() => {
    mockUtil.setUp('myunittest', TestType.unit, ['empty'], 'user1');
  });
```

### Unit Testing

Unit test specs should reside in the `cypress/unit` directory.

Unit tests are written to rely solely on mock data. As mentioned above, data can be mocked by specifying fixtures that will be
automatically loaded by the infrastructure or by defining routes in-line in the spec.

There are template fixtures in the cypress/fixtures/templates directory to help you start mocking calls that are invoked on display
of the homepage. Or you may choose to define your own test specific fixture in your test specific directory or construct routes
inline in your test code.

### E2E Testing

E2E test specs should reside in the `cypress/e2e` directory.

E2e tests should be written to exercise user flows and examine DOM elements based on the content of response data. This allows
e2e tests to be agnostic about the environment within which they are run. You can, and probably should, define a template to be
utilized for use in the checkin pipeline.

### Recording Fixtures

The testing framework has a switch to allow recording XHR response data into _mockdata.json_ fixture files. Enable recording by:

- Run the tests by using the `npm run cypress:runrecord` script.
- Run Cypress using the `npm run cypress:openrecord` script and then run individual tests.
- Modify the call to the `setUp` method in a specific test to pass the optional fourth "record" parameter as `true`.

Recorded response fixtures are written to the _cypress/recordings/testname/date_ directory.

## Running Tests

The following scripts exist in the package.json to facilitate running Cypress tests. All require that you
start the web server in a separate command window.

cypress:open - Open the Cypress dashboard
cypress:openmock - Open the Cypress dashboard with the "mock" environment variable injected into the Cypress environment
cypress:openrecord - Open the Cypress dashboard with the "record" environment variable injected into the Cypress environment
cypress:run - Run the Cypress specs
cypress:runmock - Run the Cypress specs with the "mock" environment variable injected into the Cypress environment
cypress:runrecord - Run the Cypress specs with the "record" environment variable injected into the Cypress environment
