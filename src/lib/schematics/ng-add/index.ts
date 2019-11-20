import { Rule, chain, Tree, externalSchematic } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '@angular/material/schematics/ng-add/package-config';
import { uiPlatformVersion } from '../version-names';
import { ISchema } from './schema';
import { IComponent, SSO } from '../components';
import { getProjectFromWorkspace, addModuleImportToRootModule } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { experimental } from '@angular-devkit/core';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';

const vantageAuthenticationModuleName: string = 'VantageAuthenticationModule';
const vantageAuthenticationInterceptorName: string = 'VantageAuthenticationInterceptor';
const vantageUserModuleName: string = 'VantageUserModule';

export function addDependenciesAndFiles(options: ISchema): Rule {
  return chain([
    (host: Tree) => {
      addPackageToPackageJson(host, '@td-vantage/ui-platform', `~${uiPlatformVersion}`);

      /*let ssoComponent: IComponent = new SSO();
      if (ssoComponent.enabled) {
        // ask urls for proxy file (this code should move to schema file)
        addSSOModule(options);
      }*/
    },
    // externalSchematic('@covalent/core', 'covalent-shell', {}),
  ]);
}

/*function addSSOModule(options: ISchema): Rule {
  return (host: Tree) => {
    const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(host);
    const project: experimental.workspace.WorkspaceProject = getProjectFromWorkspace(workspace);
    addModuleImportToRootModule(host, vantageAuthenticationModuleName, '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, vantageAuthenticationInterceptorName, '@td-vantage/ui-platform/auth', project);
    addModuleImportToRootModule(host, vantageUserModuleName, '@td-vantage/ui-platform/user', project);
    addInterceptorProviders(workspace, project);
    return host;
  };
}

function addInterceptorProviders(workspace: experimental.workspace.WorkspaceSchema, project: experimental.workspace.WorkspaceProject): Rule {
  /**
   * write your own function based on: insertAfterLastOccurrence
   * find the last import statement and find the position and add :
   * const httpInterceptorProviders: Type<IHttpInterceptor>[] = [VantageAuthenticationInterceptor];
   */
  /*return (host: Tree) => {
    addModuleImportToRootModule(host, vantageUserModuleName, '@td-vantage/ui-platform/user', project);
    addProviderToModule(source, modulePath: string, classifiedName: string, importPath: string)
    return host;
  };
  
}*/
