import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const storedUser = this.getStoredUser();

    if (!storedUser?.email) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrders(storedUser.email);
  }

  loadOrders(email: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrdersByEmail(email).subscribe({
      next: (orders) => {
        this.orders.set(orders || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your orders right now.');
        this.isLoading.set(false);
      }
    });
  }

  parseItems(items: string): OrderItem[] {
    if (!items) {
      return [];
    }

    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  formatStatus(status: string): string {
    return status ? status.toUpperCase() : 'PENDING';
  }

  private getStoredUser(): any {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }
}
