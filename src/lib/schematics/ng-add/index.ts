
import {
  Rule,
  chain,
  Tree,
  mergeWith,
  url,
  apply,
  branchAndMerge,
  template,
  UpdateRecorder,
  FileEntry,
  SchematicContext,
} from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '@angular/material/schematics/ng-add/package-config';
import { uiPlatformVersion } from '../version-names';
import { ISchema } from './schema';
import { strings } from '@angular-devkit/core';

import { getProjectFromWorkspace, addModuleImportToRootModule } from '@angular/cdk/schematics';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getWorkspace } from '@schematics/angular/utility/config';
import { experimental } from '@angular-devkit/core';

import { getSourceFile, getProjectMainFile, getProjectStyleFile } from '@angular/cdk/schematics/utils';

import { SourceFile } from 'typescript';
import { Change } from '@schematics/angular/utility/change';

export function addDependenciesAndFiles(options: ISchema): Rule {
  const addVantagePacakgeRule: Rule = (host: Tree) => {
    addPackageToPackageJson(host, '@td-vantage/ui-platform', `${uiPlatformVersion}`);
  };

  const ruleSet: Rule[] = [addVantagePacakgeRule];

  if (options.ssoServerURL && options.ssoServerURL.trim().length) {
    // enable SSO
    ruleSet.push(mergeFiles(options));
    ruleSet.push(addSSOImports);
    ruleSet.push(updateStyles);
  }
  return chain(ruleSet);
}

function mergeFiles(options: ISchema): Rule {
  const templateSource: any = apply(url('./files'), [
    template({
      ...strings,
      ...options,
    }),
  ]);
  return branchAndMerge(mergeWith(templateSource));
}

function updateStyles(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
    const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
    const styleFilePath: string = getProjectStyleFile(project);
    const file: Buffer = host.read(styleFilePath);
    const themeFile: FileEntry = host.get('theme.scss');
    const fileContent: string = file.toString();
    const content: string = themeFile && themeFile.content.toString();

    if (content) {
      host.overwrite(styleFilePath, fileContent + '\n' + content);
      host.delete('theme.scss');
    }

    return host;
  };
}

function addSSOImports(): Rule {
  return (host: Tree) => {
    const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
    const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
    const replacementString: string = `CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: VantageAuthenticationInterceptor, paths: ['**'],
      }],
    })`;

    addModuleImportToRootModule(host, 'VantageAuthenticationModule', '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, 'VantageUserModule', '@td-vantage/ui-platform/user', project);
    addModuleImportToRootModule(host, `CovalentHttpModule.forRoot()`, '@covalent/http', project);
    replaceContentInAppModule(host, `CovalentHttpModule.forRoot()`, replacementString);
    addModuleImportToRootModule(host, 'appRoutes', './app.routes', project);
    addProvider(host, `VantageAuthenticationInterceptor`, '@td-vantage/ui-platform/auth');
    addProvider(host, `appRoutingProviders`, './app.routes');
  };
}

function addProvider(host: Tree, classifiedName: string, importPath: string): void {
  const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
  const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
  const modulePath: string = getAppModulePath(host, getProjectMainFile(project));
  const moduleSource: SourceFile = getSourceFile(host, modulePath);
  const changes: Change[] = addProviderToModule(moduleSource, modulePath, classifiedName, importPath);
  applyChanges(host, modulePath, changes);
}

function applyChanges(tree: Tree, path: string, changes: Change[]): void {
  const recorder: UpdateRecorder = tree.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  tree.commitUpdate(recorder);
}

function replaceContentInAppModule(host: Tree, match: string, replacement: string): void {
  const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
  const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
  const modulePath: string = getAppModulePath(host, getProjectMainFile(project));
  const content: string = host.get(modulePath).content.toString();
  host.overwrite(modulePath, content.replace(match, replacement));
}
