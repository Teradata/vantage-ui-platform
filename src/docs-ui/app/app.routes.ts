import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';
import { VantageBlockRootAccessGuard, VantageBlockUserAccessGuard } from '@td-vantage/ui-platform/access';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: MainComponent, canActivate: [ VantageAuthenticationGuard ] },
  { path: 'block-root', component: MainComponent, canActivate: [ VantageBlockRootAccessGuard ] },
  { path: 'block-user', component: MainComponent, canActivate: [ VantageBlockUserAccessGuard ] },
  { path: '**', redirectTo: '/', },
];

export const appRoutingProviders: any[] = [

];

export const appRoutes: any = RouterModule.forRoot(routes);
