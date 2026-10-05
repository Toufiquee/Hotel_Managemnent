import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartService, Product } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CartIcon } from '../../components/cart-icon/cart-icon';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterLink, CartIcon],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})

export class Shop {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  
  products = toSignal(this.productService.getProducts(), { initialValue: [] as Product[] });
  categories = toSignal(this.productService.getCategories(), { initialValue: [] as string[] });
  selectedCategory = signal<string>('All');
  
   filteredProducts = computed(() => {
    const products = this.products();
    const category = this.selectedCategory();
    
    if (category === 'All') {
      return products;
    }
    
    return products.filter(p => p.category === category);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}

/* 
  How can we fetch the data category wise 
*/