import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

import { VantageAuthenticationGuard } from '@td-vantage/ui-platform/auth';
import { VantageBlockRootAccessGuard, VantageBlockUserAccessGuard } from '@td-vantage/ui-platform/access';
import { TypographyComponent } from './typography/typography.component';
import { MatComponentsComponent } from './mat-components/mat-components.component';
import { DemosComponent } from './demos/demos.component';
import { CovalentComponentsComponent } from './covalent-components/covalent-components.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'mat-components', pathMatch: 'full' },
      { path: 'demos', component: DemosComponent },
      { path: 'mat-components', component: MatComponentsComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'covalent-components', component: CovalentComponentsComponent },
    ],
  },
  { path: 'login', component: MainComponent, canActivate: [VantageAuthenticationGuard] },
  { path: 'block-root', component: MainComponent, canActivate: [VantageBlockRootAccessGuard] },
  { path: 'block-user', component: MainComponent, canActivate: [VantageBlockUserAccessGuard] },
  { path: '**', redirectTo: '/' },
];

export const appRoutingProviders: any[] = [];

export const appRoutes: any = RouterModule.forRoot(routes);
