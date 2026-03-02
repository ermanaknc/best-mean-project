import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./posts/post-list/post-list.component').then(m => m.PostListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./posts/post-create/post-create.component').then(m => m.PostCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'edit/:postId',
    loadComponent: () =>
      import('./posts/post-create/post-create.component').then(m => m.PostCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then(m => m.SignupComponent),
  },
  { path: '**', redirectTo: '' },
];
