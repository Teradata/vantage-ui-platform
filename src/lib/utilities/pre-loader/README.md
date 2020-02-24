# Pre loader

A loader that can be displayed before the angular assets are downloaded and angular is ready.

## Setup

`npm i -D @angular-builders/custom-webpack`

Update the angular.json

```json
"build": {
          "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "indexTransform": "node_modules/@td-vantage/ui-platform/utilities/pre-loader",
```

```json
  "serve": {
          "builder": "@angular-builders/custom-webpack:dev-server",
```

That's it! The pre-loader markup will be inserted into the index html right before the closing body tag.
