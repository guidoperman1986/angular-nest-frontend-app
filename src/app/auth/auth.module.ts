import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthComponent } from './layout/auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
