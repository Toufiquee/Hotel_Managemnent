import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartIcon } from '../../components/cart-icon/cart-icon';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, CartIcon],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private cartService = inject(CartService);
  
  cartItems = this.cartService.items;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;

  updateQuantity(productId: number, delta: number): void {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + delta);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}