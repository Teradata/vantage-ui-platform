import { Routes, RouterModule } from '@angular/router';

import { VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';

const routes: Routes = [
  {
    path: '',
    canActivate: [VantageAuthenticationGuard],
    children: [],
  },
  { path: '**', redirectTo: '/' },
];

export const appRoutingProviders: any[] = [VantageAuthenticationGuard];

export const appRoutes: any = RouterModule.forRoot(routes);
