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
    name: 'bar',
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

    const expectedUIPlatformVersion: string = `~${uiPlatformVersion}`;

    expectVersionToBe(dependencies, '@td-vantage/ui-platform', expectedUIPlatformVersion);
  });

  function expectVersionToBe(dependencies: any, name: string, expectedVersion: string): void {
    expect(dependencies[name]).toBe(
      expectedVersion,
      'Expected ' + name + ' package to have ' + `~${expectedVersion}` + ' version.',
    );
  }
});
