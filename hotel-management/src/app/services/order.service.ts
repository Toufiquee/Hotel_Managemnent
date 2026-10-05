import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: string;
  items: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
}

export interface OrderResponse {
  message: string;
  orderId: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5038/api';

  constructor(private http: HttpClient) { }

  createOrder(orderDetails: OrderDetails): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders`, orderDetails);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getOrdersByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/email/${email}`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
  }

  updateOrder(id: number, orderDetails: OrderDetails): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${id}`, orderDetails);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/orders/${id}`);
  }
}
