import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.productRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/order/order.routes').then(m => m.orderRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/user/user.routes').then(m => m.userRoutes)
  }
];
