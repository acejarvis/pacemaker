import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/web/auth.guard';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: 'signup', component: SignupComponent, data: { title: 'Sign Up' }},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { title: 'Home' }},
  // { path: 'home', component: HomeComponent,  data: { title: 'Home' }},

  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
