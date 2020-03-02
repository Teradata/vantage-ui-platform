import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';
import { VantageBlockRootAccessGuard, VantageBlockUserAccessGuard } from '@td-vantage/ui-platform/access';
import { TypographyComponent } from './typography/typography.component';
import { MatComponentsComponent } from './mat-components/mat-components.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'components', pathMatch: 'full' },
      { path: 'components', component: MatComponentsComponent },
      { path: 'typography', component: TypographyComponent },
    ],
  },
  { path: 'login', component: MainComponent, canActivate: [VantageAuthenticationGuard] },
  { path: 'block-root', component: MainComponent, canActivate: [VantageBlockRootAccessGuard] },
  { path: 'block-user', component: MainComponent, canActivate: [VantageBlockUserAccessGuard] },
  { path: '**', redirectTo: '/' },
];

export const appRoutingProviders: any[] = [];

export const appRoutes: any = RouterModule.forRoot(routes);
