import { ISchema } from './ng-add/schema';

export interface IComponent {
  enabled(options: ISchema): boolean;
}

export class SSO implements IComponent {
  public enabled(options: ISchema): boolean {
    return options.sso;
  }
}
