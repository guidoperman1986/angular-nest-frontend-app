import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/is-not-authenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
