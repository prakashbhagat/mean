import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderFormComponent } from './order-form/order-form.component';

export const orderRoutes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'add', component: OrderFormComponent },
  { path: 'edit/:id', component: OrderFormComponent }
];