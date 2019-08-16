# Cypress testing utilities

## Login and logout

Functions to help facilitate logging in and out in

- `ssoLogin()`
- `ssoLogout()`

### Setup

- `baseUrl`

  - must be defined in the cypress config (cypress.json)
  - ex: http://localhost:4200

- `ssoUrl`
  - must be defined in the cypress env config (cypress.env.json)
  - ex: https://vantage.url.io/auth

### Usage

```typescript
import { ssoLogin, ssoLogout } from '@td-vantage/ui-platform/testing/cypress';

ssoLogin({
  username: 'username',
  password: 'password',
});

ssoLogout();
```
