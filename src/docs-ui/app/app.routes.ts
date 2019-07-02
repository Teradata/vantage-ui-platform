import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { VantageAuthenticationGuard } from '@vantage/ui-platform/auth';

const routes: Routes = [{
    path: '', component: MainComponent, canActivate: [ VantageAuthenticationGuard ],
  }, {
    path: '**', redirectTo: '/',
  },
];

export const appRoutingProviders: any[] = [

];

export const appRoutes: any = RouterModule.forRoot(routes);
