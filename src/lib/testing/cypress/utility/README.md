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
