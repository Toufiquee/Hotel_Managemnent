import { Component, inject, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { CartIcon } from '../../components/cart-icon/cart-icon';

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
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
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  @ViewChild('stripePaymentElement') stripePaymentElement?: ElementRef<HTMLDivElement>;

  cartItems = this.cartService.items;
  total = this.cartService.total;

  paymentMethod = signal<'stripe' | 'cod'>('stripe');
  isProcessing = signal(false);
  orderComplete = signal(false);
  paymentError = signal('');
  stripeLoading = signal(false);
  createdOrderId = signal<number | null>(null);

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

  private stripe: Stripe | null = null;
  private stripeElements: StripeElements | null = null;
  private stripePaymentElementInstance: StripePaymentElement | null = null;
  private clientSecret = '';
  private paymentIntentId = '';

  ngOnInit() {
    if (this.cartItems().length === 0) {
      this.router.navigate(['/shop']);
      return;
    }

    if (this.paymentMethod() === 'stripe') {
      void this.initializeStripe();
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
    this.paymentError.set('');

    if (method === 'stripe') {
      void this.initializeStripe();
    } else {
      this.destroyStripeElements();
    }
  }

  async processPayment(): Promise<void> {
    if (!this.validateForm()) return;

    this.isProcessing.set(true);
    this.paymentError.set('');

    if (this.paymentMethod() === 'stripe') {
      await this.processStripePayment();
    } else {
      await this.processCODPayment();
    }
  }

  private async initializeStripe(): Promise<void> {
    if (this.stripeLoading()) return;

    this.stripeLoading.set(true);
    this.paymentError.set('');
    this.destroyStripeElements();

    try {
      const paymentOrder = await firstValueFrom(this.paymentService.createOrder({
        amount: this.finalTotal,
        currency: 'usd'
      }));

      this.clientSecret = paymentOrder.clientSecret;
      this.paymentIntentId = paymentOrder.paymentIntentId;
      this.stripe = await this.paymentService.initStripe(paymentOrder.publishableKey);

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const container = this.stripePaymentElement?.nativeElement;
      if (!container) {
        throw new Error('Payment form is not ready. Please try again.');
      }

      const mounted = this.paymentService.mountPaymentElement(
        this.stripe,
        this.clientSecret,
        container
      );
      this.stripeElements = mounted.elements;
      this.stripePaymentElementInstance = mounted.paymentElement;
    } catch (error: unknown) {
      const err = error as Error;
      this.paymentError.set(err.message || 'Failed to load Stripe payment form.');
    } finally {
      this.stripeLoading.set(false);
    }
  }

  private destroyStripeElements(): void {
    this.stripePaymentElementInstance?.unmount();
    this.stripePaymentElementInstance = null;
    this.stripeElements = null;
    this.stripe = null;
    this.clientSecret = '';
    this.paymentIntentId = '';
  }

  private async processStripePayment(): Promise<void> {
    try {
      if (this.stripeLoading()) {
        throw new Error('Payment form is still loading. Please wait a moment.');
      }

      if (!this.stripe || !this.stripeElements || !this.clientSecret) {
        throw new Error('Stripe payment form is not ready. Select Pay with Stripe again.');
      }

      const confirmedPaymentIntentId = await this.paymentService.confirmPayment(
        this.stripe,
        this.stripeElements,
        this.clientSecret,
        {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone.replace(/\D/g, '')
        }
      );

      const verification = await firstValueFrom(this.paymentService.verifyPayment({
        paymentIntentId: confirmedPaymentIntentId || this.paymentIntentId
      }));

      if (!verification.success) {
        throw new Error(verification.message || 'Payment verification failed.');
      }

      await this.submitOrder('Stripe', 'paid');
    } catch (error: unknown) {
      const err = error as Error;
      this.paymentError.set(err.message || 'Payment failed. Please try again.');
      this.isProcessing.set(false);
    }
  }

  private async processCODPayment(): Promise<void> {
    await this.submitOrder('Cash on Delivery', 'pending');
  }

  private submitOrder(paymentMethod: string, status: string): Promise<void> {
    const items = this.cartItems().map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderRequest = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      address: this.form.address,
      city: this.form.city,
      zipCode: this.form.zipCode,
      paymentMethod,
      items: JSON.stringify(items),
      subtotal: this.total(),
      tax: this.tax,
      total: this.finalTotal,
      status
    };

    return new Promise((resolve, reject) => {
      this.orderService.createOrder(orderRequest).subscribe({
        next: (response) => {
          this.createdOrderId.set(response.orderId);
          this.isProcessing.set(false);
          this.orderComplete.set(true);
          this.cartService.clearCart();
          resolve();
        },
        error: (error) => {
          this.paymentError.set(error.error?.message || 'Order creation failed. Please try again.');
          this.isProcessing.set(false);
          reject(error);
        }
      });
    });
  }
}
