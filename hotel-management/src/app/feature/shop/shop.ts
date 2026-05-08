import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
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
  
  products = this.productService.getProducts();
  categories = this.productService.getCategories();
  selectedCategory = signal<string>('All');
  
  filteredProducts(): Observable<Product[]> {
    const category = this.selectedCategory();
    console.log('Selected Category:', category);
    if(category === 'All')
      return this.products;
    
    return this.products.pipe(
    map(products => {

      console.log(products);

      return products.filter(p => {
        console.log(p.category);

        return p.category === category;
      });

    })
  );
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}