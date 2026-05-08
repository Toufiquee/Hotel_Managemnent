import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface Order {
  id: number;
  customer: string;
  items: string;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
  time: string;
}

interface Stats {
  revenue: number;
  orders: number;
  customers: number;
  items: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  currentView = signal('dashboard');
  sidebarCollapsed = signal(false);

  stats: Stats = {
    revenue: 12450.00,
    orders: 156,
    customers: 89,
    items: 24
  };

  recentOrders: Order[] = [
    { id: 1001, customer: 'John Smith', items: 'Grilled Salmon + Caesar Salad', total: 37.98, status: 'Preparing', time: '2 min ago' },
    { id: 1002, customer: 'Sarah Johnson', items: 'Wagyu Steak', total: 45.99, status: 'Pending', time: '5 min ago' },
    { id: 1003, customer: 'Mike Chen', items: 'Truffle Pasta + Lobster Bisque', total: 37.98, status: 'Ready', time: '12 min ago' },
    { id: 1004, customer: 'Emily Davis', items: 'Ribeye Steak', total: 32.99, status: 'Delivered', time: '25 min ago' },
    { id: 1005, customer: 'Robert Taylor', items: 'Chocolate Cake x2', total: 19.98, status: 'Pending', time: '28 min ago' }
  ];

  menuItems: MenuItem[] = [
    { id: 1, name: 'Grilled Salmon', price: 24.99, category: 'Seafood', available: true },
    { id: 2, name: 'Wagyu Steak', price: 45.99, category: 'Meat', available: true },
    { id: 3, name: 'Caesar Salad', price: 12.99, category: 'Salad', available: true },
    { id: 4, name: 'Lobster Bisque', price: 14.99, category: 'Soup', available: false },
    { id: 5, name: 'Truffle Pasta', price: 22.99, category: 'Pasta', available: true },
    { id: 6, name: 'Chocolate Cake', price: 9.99, category: 'Dessert', available: true }
  ];

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  setView(view: string) {
    this.currentView.set(view);
  }

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }
}
