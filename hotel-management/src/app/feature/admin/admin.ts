import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface Order {
  id: number;
  customer: string;
  email?: string;
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  currentView = signal('dashboard');
  sidebarCollapsed = signal(false);
  menuForm!: FormGroup;
  isSubmitting = signal(false);
  feedbackMessage = signal('');

  stats: Stats = {
    revenue: 12450.00,
    orders: 156,
    customers: 89,
    items: 24
  };

  recentOrders: Order[] = [];
  allOrders: Order[] = [];

  menuItems: MenuItem[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.refreshMenu();
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const mappedOrders = orders.map((order) => this.mapOrder(order));
        this.allOrders = mappedOrders;
        this.recentOrders = mappedOrders.slice(0, 5);
        this.stats.orders = mappedOrders.length;
        this.stats.revenue = Number(mappedOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2));
        this.stats.customers = new Set(mappedOrders.map((order) => order.email).filter(Boolean)).size;
      },
      error: () => {
        this.feedbackMessage.set('Unable to load orders right now.');
      }
    });
  }

  private mapOrder(order: any): Order {
    let items = 'Items';

    try {
      const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(parsedItems)) {
        items = parsedItems.map((item: any) => `${item.name} x${item.quantity}`).join(', ');
      } else if (parsedItems && typeof parsedItems === 'object') {
        items = parsedItems.name || 'Items';
      } else if (parsedItems) {
        items = String(parsedItems);
      }
    } catch {
      items = order.items || 'Items';
    }

    return {
      id: order.id ?? 0,
      customer: order.name || 'Unknown Customer',
      email: order.email || '',
      items,
      total: Number(order.total ?? 0),
      status: this.normalizeStatus(order.status),
      time: this.formatOrderTime(order.orderDate)
    };
  }

  private normalizeStatus(status: string | undefined): Order['status'] {
    switch (status?.toLowerCase()) {
      case 'preparing':
      case 'processing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
      case 'completed':
        return 'Delivered';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  private formatOrderTime(dateValue: string | Date | undefined): string {
    if (!dateValue) {
      return 'Recently placed';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'Recently placed';
    }

    return date.toLocaleString();
  }

  refreshMenu(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.menuItems = products.map((product) => ({
          ...product,
          available: true
        }));
        this.stats.items = this.menuItems.length;
      },
      error: () => {
        this.feedbackMessage.set('Unable to load menu items right now.');
      }
    });
  }

  onSubmitMenu(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.feedbackMessage.set('');

    this.productService.createProduct(this.menuForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.feedbackMessage.set('Product added successfully.');
        this.menuForm.reset({ price: 0, category: '' });
        this.refreshMenu();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.feedbackMessage.set('Unable to add the product.');
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.refreshMenu();
        this.feedbackMessage.set('Product removed.');
      },
      error: () => {
        this.feedbackMessage.set('Unable to remove the product.');
      }
    });
  }

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
