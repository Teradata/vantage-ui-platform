import { getFileContent } from '@schematics/angular/utility/test';
import { Tree } from '@angular-devkit/schematics';
import { uiPlatformVersion } from '../version-names';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

const collectionPath: string = require.resolve('../collection.json');

describe('ng-add schematic', () => {
  const testRunner: SchematicTestRunner = new SchematicTestRunner('rocket', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '1.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'ui-platform-workspace',
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    const workspaceTree: UnitTestTree = await testRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    appTree = await testRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, workspaceTree)
      .toPromise();
  });

  it('should update package.json', async () => {
    const tree: Tree = await testRunner.runSchematicAsync('ng-add', undefined, appTree).toPromise();
    const packageJson: any = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies: any = packageJson.dependencies;

    const expectedUIPlatformVersion: string = `${uiPlatformVersion}`;

    expectVersionToBe(dependencies, '@td-vantage/ui-platform', expectedUIPlatformVersion);
  });

  it('should create proxy.conf.js when sso option is selected by user', async () => {
    const dependencyOptions: any = { ssoServerURL: 'https://vantage.url.io' };
    const tree: Tree = await testRunner.runSchematicAsync('ng-add', dependencyOptions, appTree).toPromise();
    expect(tree.exists('proxy.conf.js')).toBe(true);
    const fileContent: string = getFileContent(tree, 'proxy.conf.js');
    expect(fileContent).toContain('https://vantage.url.io');
  });

  it('should import Vantage Auth modules to app.module.ts when sso option is selected by user', async () => {
    const dependencyOptions: any = { ssoServerURL: 'https://vantage.url.io' };
    const tree: Tree = await testRunner.runSchematicAsync('ng-add', dependencyOptions, appTree).toPromise();
    const fileContent: string = getFileContent(tree, 'projects/ui-platform-workspace/src/app/app.module.ts');
    expect(fileContent).toContain('VantageAuthenticationModule');
    expect(fileContent).toContain('VantageAuthenticationInterceptor');
    expect(fileContent).toContain('VantageUserModule');
    expect(fileContent).toContain('CovalentHttpModule');
  });

  it('should create app.routes.ts when sso option is selected by user', async () => {
    const dependencyOptions: any = { ssoServerURL: 'https://vantage.url.io' };
    const tree: Tree = await testRunner.runSchematicAsync('ng-add', dependencyOptions, appTree).toPromise();
    expect(tree.exists('src/app/app.routes.ts')).toBe(true);
    const fileContent: string = getFileContent(tree, 'src/app/app.routes.ts');
    expect(fileContent).toContain('VantageAuthenticationGuard');
  });

  it('should import route provider to app.module.ts when sso option is selected by user', async () => {
    const dependencyOptions: any = { ssoServerURL: 'https://vantage.url.io' };
    const tree: Tree = await testRunner.runSchematicAsync('ng-add', dependencyOptions, appTree).toPromise();
    const fileContent: string = getFileContent(tree, 'projects/ui-platform-workspace/src/app/app.module.ts');
    expect(fileContent).toContain('appRoutes');
    expect(fileContent).toContain('appRoutingProviders');
  });

  function expectVersionToBe(dependencies: any, name: string, expectedVersion: string): void {
    expect(dependencies[name]).toBe(
      expectedVersion,
      'Expected ' + name + ' package to have ' + `${expectedVersion}` + ' version.',
    );
  }
});
