import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

export interface CreatePaymentOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
}

export interface CreatePaymentOrderResponse {
  clientSecret: string;
  publishableKey: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  paymentIntentId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:5038/api/payment';

  constructor(private http: HttpClient) {}

  createOrder(request: CreatePaymentOrderRequest): Observable<CreatePaymentOrderResponse> {
    return this.http.post<CreatePaymentOrderResponse>(`${this.apiUrl}/create-order`, request);
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<VerifyPaymentResponse> {
    return this.http.post<VerifyPaymentResponse>(`${this.apiUrl}/verify`, request);
  }

  async initStripe(publishableKey: string): Promise<Stripe> {
    const stripe = await loadStripe(publishableKey);
    if (!stripe) {
      throw new Error('Stripe failed to load. Please refresh and try again.');
    }
    return stripe;
  }

  mountPaymentElement(
    stripe: Stripe,
    clientSecret: string,
    container: HTMLElement
  ): { elements: StripeElements; paymentElement: StripePaymentElement } {
    const elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: 'night',
        variables: { colorPrimary: '#e67e22' }
      }
    });

    const paymentElement = elements.create('payment');
    paymentElement.mount(container);

    return { elements, paymentElement };
  }

  async confirmPayment(
    stripe: Stripe,
    elements: StripeElements,
    clientSecret: string,
    billingDetails: { name: string; email: string; phone: string }
  ): Promise<string> {
    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error(submitError.message ?? 'Payment form validation failed.');
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone
          }
        }
      }
    });

    if (error) {
      throw new Error(error.message ?? 'Payment failed.');
    }

    if (!paymentIntent?.id) {
      throw new Error('Payment confirmation did not return a payment intent.');
    }

    return paymentIntent.id;
  }
}
