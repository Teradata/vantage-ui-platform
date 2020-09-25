import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import chalk from 'chalk';
import { TargetVersion } from './target-version';

const green: any = chalk.green;
const yellow: any = chalk.yellow;

export interface IPackage {
  dependencies?: object;
}

export function updateDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Running covalent update schematic ...');
    const pkgPath: string = '/package.json';
    const buffer: Buffer = tree.read(pkgPath);
    if (buffer === undefined) {
      throw new SchematicsException('Could not read package.json');
    }
    const content: string = buffer.toString();
    const pkg: IPackage = JSON.parse(content);

    if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
      throw new SchematicsException('Error reading package.json');
    }

    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }

    const packagesUpdated: boolean = updateCovalentPackage(pkg, tree, pkgPath);
    if (packagesUpdated) {
      onMigrationComplete();
    }

    return tree;
  };

  function updateCovalentPackage(pkg: IPackage, tree: Tree, pkgPath: string): boolean {
    let isCovalentUpdated: boolean = false;
    if (pkg.dependencies !== {} && Object.keys(pkg.dependencies) && Object.keys(pkg.dependencies).length !== 0) {
      Object.keys(pkg.dependencies).forEach((key: string) => {
        if (key.includes('@covalent')) {
          pkg.dependencies[key] = TargetVersion.VERSION;
          tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
          isCovalentUpdated = true;
        }
      });
    }
    return isCovalentUpdated;
  }

  function onMigrationComplete(): void {
    // tslint:disable: no-console
    console.log();
    console.log(green(`  ✓  Updated Covalent to ${TargetVersion.VERSION}`));
    console.log();
    console.log(
      yellow(
        '  ⚠  Breaking changes are not applied automatically! Please refer the docs' +
          '(https://github.com/Teradata/covalent/wiki) and fix the issues manually',
      ),
    );
  }
}
