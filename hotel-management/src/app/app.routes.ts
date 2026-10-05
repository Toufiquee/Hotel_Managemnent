import { Routes } from '@angular/router';
import { Landing } from './feature/landing/landing';
import { Register } from './feature/register/register';
import { Menu } from './feature/menu/menu';
import { AboutUs } from './feature/about-us/about-us';
import { Shop } from './feature/shop/shop';
import { Cart } from './feature/cart/cart';
import { Checkout } from './feature/checkout/checkout';
import { ReservationComponent } from './feature/reservation/reservation';
import { Reviews } from './feature/reviews/reviews';
import { Login } from './feature/login/login';
import { Admin } from './feature/admin/admin';
import { MyOrders } from './feature/my-orders/my-orders';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'menu', component: Menu},
  { path: 'aboutus', component: AboutUs},
  { path: 'shop', component: Shop },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'my-orders', component: MyOrders },
  { path: 'reservation', component: ReservationComponent },
  { path: 'reviews', component: Reviews },
  { path: 'admin', component: Admin, canActivate: [adminGuard] }
];
