import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { HomeComponent } from './tweets/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tweets', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'user',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tweets',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];
