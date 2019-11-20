import { Rule, chain, Tree, mergeWith, url, apply, branchAndMerge, template } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '@angular/material/schematics/ng-add/package-config';
import { uiPlatformVersion } from '../version-names';
import { ISchema } from './schema';
import { strings } from '@angular-devkit/core';

export function addDependenciesAndFiles(options: ISchema): Rule {
  let ruleSet: Rule[] = [
    (host: Tree) => {
      addPackageToPackageJson(host, '@td-vantage/ui-platform', `~${uiPlatformVersion}`);
    },
  ];
      
  if (options.ssoServerURL && options.ssoServerURL.trim().length) { // enable SSO
    ruleSet.push(mergeFiles(options));
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
