import { Rule, chain, Tree, mergeWith, url, apply, branchAndMerge, SchematicsException, template, UpdateRecorder } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '@angular/material/schematics/ng-add/package-config';
import { uiPlatformVersion } from '../version-names';
import { ISchema } from './schema';
import { strings } from '@angular-devkit/core';

import { getProjectFromWorkspace, addModuleImportToRootModule } from '@angular/cdk/schematics';
import { addImportToModule, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getWorkspace } from '@schematics/angular/utility/config';
import { experimental } from '@angular-devkit/core';
import { getSourceFile, getProjectMainFile } from '@angular/cdk/schematics/utils';
import { SourceFile } from 'typescript';
import { Change } from '@schematics/angular/utility/change';

export function addDependenciesAndFiles(options: ISchema): Rule {
  let addVantagePacakgeRule: Rule = (host: Tree) => {
    addPackageToPackageJson(host, '@td-vantage/ui-platform', `~${uiPlatformVersion}`);
  };

  let ruleSet: Rule[] = [addVantagePacakgeRule];
      
  if (options.ssoServerURL && options.ssoServerURL.trim().length) { // enable SSO
    ruleSet.push(mergeFiles(options));
    ruleSet.push(addSSOImports);
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

function addSSOImports(): Rule { 
  return (host: Tree) => {
    const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
    const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
    // Add import and entry in NGModule
    addModuleImportToRootModule(host, 'VantageAuthenticationModule', '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, 'VantageUserModule', '@td-vantage/ui-platform/user', project);
    addModuleImportToRootModule(host, `CovalentHttpModule.forRoot()`, '@covalent/http', project);
    
    insertImportOnly(host, 'VantageAuthenticationInterceptor', '@td-vantage/ui-platform/auth');
  };
}

function insertImportOnly(host: Tree, symbolName: string, fileName: string): void {
  const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
  const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
  const modulePath: string = getAppModulePath(host, getProjectMainFile(project));
  const moduleSource: SourceFile = getSourceFile(host, modulePath);
  const recorder: UpdateRecorder = host.beginUpdate(modulePath);
  const importChange: InsertChange = insertImport(moduleSource, modulePath, symbolName, fileName) as InsertChange;
  
  if ( importChange.toAdd ) {
    recorder.insertLeft(importChange.pos, importChange.toAdd);
  }
  host.commitUpdate(recorder);
}
