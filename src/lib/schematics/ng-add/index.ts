import { Rule, chain, Tree, mergeWith, url, apply, branchAndMerge, template } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '@angular/material/schematics/ng-add/package-config';
import { uiPlatformVersion } from '../version-names';
import { ISchema } from './schema';
import { strings } from '@angular-devkit/core';

import { getProjectFromWorkspace, addModuleImportToRootModule } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { experimental } from '@angular-devkit/core';
const vantageAuthenticationModuleName: string = 'VantageAuthenticationModule';
const vantageAuthenticationInterceptorName: string = 'VantageAuthenticationInterceptor';
const vantageUserModuleName: string = 'VantageUserModule';

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
    addModuleImportToRootModule(host, vantageAuthenticationModuleName, '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, vantageAuthenticationInterceptorName, '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, vantageUserModuleName, '@td-vantage/ui-platform/user', project);
  };
}
