import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-icon',
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/cart" class="cart-icon">
      <span class="cart-emoji">🛒</span>
      @if (itemCount() > 0) {
        <span class="cart-badge">{{ itemCount() }}</span>
      }
    </a>
  `,
  styles: [`
    .cart-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.2s ease;
      text-decoration: none;
    }
    
    .cart-icon:hover {
      background: rgba(241, 196, 15, 0.1);
    }
    
    .cart-emoji {
      font-size: 1.5rem;
    }
    
    .cart-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: linear-gradient(to right, #e74c3c, #c0392b);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      animation: bounce 0.3s ease;
    }
    
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `]
})
export class CartIcon {
  private cartService = inject(CartService);
  itemCount = this.cartService.itemCount;
}