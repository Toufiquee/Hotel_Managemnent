import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartIcon } from '../../components/cart-icon/cart-icon';

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink, CartIcon],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  
  cartItems = this.cartService.items;
  total = this.cartService.total;
  
  paymentMethod = signal<'stripe' | 'cod'>('stripe');
  isProcessing = signal(false);
  orderComplete = signal(false);
  stripeLoaded = signal(false);
  cardError = signal('');
  
  form: CheckoutForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  };
  
  errors: FormErrors = {};
  
  tax = this.cartService.total() * 0.1;
  finalTotal = this.cartService.total() * 1.1;

  private stripe: any;
  private elements: any;
  private cardElement: any;

  async ngOnInit() {
    if (this.cartItems().length === 0) {
      this.router.navigate(['/shop']);
      return;
    }
  }

  validateForm(): boolean {
    this.errors = {};
    
    if (!this.form.name.trim()) {
      this.errors.name = 'Name is required';
    } else if (this.form.name.trim().length < 2) {
      this.errors.name = 'Name must be at least 2 characters';
    }
    
    if (!this.form.email.trim()) {
      this.errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errors.email = 'Invalid email format';
    }
    
    if (!this.form.phone.trim()) {
      this.errors.phone = 'Phone is required';
    } else if (!/^\d{10,15}$/.test(this.form.phone.replace(/\D/g, ''))) {
      this.errors.phone = 'Phone must be 10-15 digits';
    }
    
    if (!this.form.address.trim()) {
      this.errors.address = 'Address is required';
    } else if (this.form.address.trim().length < 5) {
      this.errors.address = 'Please enter a valid address';
    }
    
    if (!this.form.city.trim()) {
      this.errors.city = 'City is required';
    }
    
    if (!this.form.zipCode.trim()) {
      this.errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(this.form.zipCode)) {
      this.errors.zipCode = 'Invalid ZIP code';
    }
    
    return Object.keys(this.errors).length === 0;
  }

  selectPayment(method: 'stripe' | 'cod'): void {
    this.paymentMethod.set(method);
  }

  async processPayment(): Promise<void> {
    if (!this.validateForm()) return;
    
    this.isProcessing.set(true);
    
    if (this.paymentMethod() === 'stripe') {
      await this.processStripePayment();
    } else {
      await this.processCODPayment();
    }
  }

  private async processStripePayment(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderDetails: OrderDetails = {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        address: this.form.address,
        city: this.form.city,
        zipCode: this.form.zipCode,
        paymentMethod: 'Stripe Card',
        items: this.cartItems().map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: this.total(),
        tax: this.tax,
        total: this.finalTotal
      };
      
      console.log('Order placed with Stripe:', orderDetails);
      
    } catch (error: unknown) {
      const err = error as Error;
      this.cardError.set(err.message || 'Payment failed. Please try again.');
      this.isProcessing.set(false);
      return;
    }
    
    this.isProcessing.set(false);
    this.orderComplete.set(true);
    this.cartService.clearCart();
  }

  private async processCODPayment(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderDetails: OrderDetails = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      address: this.form.address,
      city: this.form.city,
      zipCode: this.form.zipCode,
      paymentMethod: 'Cash on Delivery',
      items: this.cartItems().map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal: this.total(),
      tax: this.tax,
      total: this.finalTotal
    };
    
    console.log('Order placed with COD:', orderDetails);
    
    this.isProcessing.set(false);
    this.orderComplete.set(true);
    this.cartService.clearCart();
  }
}