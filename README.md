## Vantage UI Platform

[![Build Status](https://travis-ci.org/Teradata/vantage-ui-platform.svg?branch=develop)](https://travis-ci.org/Teradata/vantage-ui-platform)
[![npm](https://img.shields.io/npm/v/%40vantage/ui-platform.svg)](https://www.npmjs.com/package/@td-vantage/ui-platform)
[![npm](https://img.shields.io/npm/v/%40vantage/ui-platform/next.svg)](https://www.npmjs.com/package/@td-vantage/ui-platform/v/next)

[![Coverage Status](https://coveralls.io/repos/github/Teradata/vantage-ui-platform/badge.svg)](https://coveralls.io/github/Teradata/vantage-ui-platform)
[![npm](https://img.shields.io/npm/l/@td-vantage/ui-platform.svg)](LICENSE)

### Components, Utilities and Services for all Teradata Angular UIs

## Information

### Setup

* Ensure you have **Node 10.15.3** (on a Mac use Homebrew and `brew install node@10.15.3`)
* Ensure you have **NPM 6+** installed.
* Install Docker Engine: [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/)
* Install Angular CLI `npm i -g @angular/cli`
* Install Typescript `npm i -g typescript`
* Install TSLint `npm i -g tslint`
* Install Protractor for e2e testing `npm i -g protractor`
* Install Node packages `npm install`

### Development

1. Update the `serverUrl` variable in the `proxy.conf.js` to point to your vantage environment.

2. Run local webserver `npm run serve`

3. In Chrome go to [http://localhost:4200](http://localhost:4200)

## Build and publish

* Build the source code

`npm run build:lib`

* Publish to npm

`npm run publish:npm`

## Usage Notes

### Single Sign-On

click here for information about [SSO](./docs/SSOINFO.md)

### Http

* HTTP in the ui-platform uses Covalent Http
  * See more information here: [https://teradata.github.io/covalent/#/components/http](https://teradata.github.io/covalent/#/components/http)
* An es7 polyfill will be required in the Angular Application
  * Create a file named `src/polyfills.ts`
  * In that file add the following import:
```
import 'core-js/es7/reflect';
```
