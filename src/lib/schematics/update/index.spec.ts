import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import chalk from 'chalk';

const green: any = chalk.green;
const yellow: any = chalk.yellow;

const migrationPath: string = require.resolve('../migration.json');
const packagePath: string = '/package.json';

function setup(): UnitTestTree {
  const tree: UnitTestTree = Tree.empty() as UnitTestTree;
  tree.create(
    packagePath,
    `{
        "dependencies": {
          "@covalent/core": "1.0.0"
        }
      }`,
  );

  return tree;
}
describe('ng-update schematic', () => {
  const testRunner: SchematicTestRunner = new SchematicTestRunner('rocket', migrationPath);
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = setup();
  });

  it('should print console messages', async () => {
    // tslint:disable-next-line: no-console
    console.log = jasmine.createSpy('log');
    const tree: any = testRunner.runSchematic('covalent-migration-01', {}, appTree);
    const pkg: any = JSON.parse(tree.readContent(packagePath));
    expect(pkg.dependencies['@covalent/core']).toBe(`latest`);
    // tslint:disable-next-line: no-console
    expect(console.log).toHaveBeenCalledWith();
    // tslint:disable-next-line
    expect(console.log).toHaveBeenCalledWith(green('  ✓  Updated Covalent to latest'));
    // tslint:disable-next-line
    expect(console.log).toHaveBeenCalledWith();
    // tslint:disable-next-line
    expect(console.log).toHaveBeenCalledWith(
      yellow(
        '  ⚠  Breaking changes are not applied automatically! Please refer the docs' +
          '(https://github.com/Teradata/covalent/wiki) and fix the issues manually',
      ),
    );
  });
});
