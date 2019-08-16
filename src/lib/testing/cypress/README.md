# Cypress testing utilities

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
