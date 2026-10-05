import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartIcon } from '../../components/cart-icon/cart-icon';
import { ReservationComponent } from '../reservation/reservation';
import { Reviews } from '../reviews/reviews';
import { AboutUs } from '../about-us/about-us';

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CartIcon, ReservationComponent, Reviews, AboutUs],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  featuredProducts: FeaturedProduct[] = [
    { id: 1, name: 'Grilled Salmon', price: 24.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300', category: 'Seafood' },
    { id: 2, name: 'Wagyu Steak', price: 45.99, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300', category: 'Meat' },
    { id: 3, name: 'Caesar Salad', price: 12.99, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300', category: 'Salad' },
    { id: 4, name: 'Lobster Bisque', price: 14.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', category: 'Soup' },
    { id: 5, name: 'Truffle Pasta', price: 22.99, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300', category: 'Pasta' },
    { id: 6, name: 'Chocolate Cake', price: 9.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300', category: 'Dessert' },
    { id: 7, name: 'Ribeye Steak', price: 32.99, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300', category: 'Meat' },
    { id: 8, name: 'Shrimp Platter', price: 28.99, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300', category: 'Seafood' }
  ];

  currentSlide = 0;
  itemsPerView = 4;

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  prevSlide() {
    const maxSlide = Math.ceil(this.featuredProducts.length / this.itemsPerView) - 1;
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : maxSlide;
  }

  nextSlide() {
    const maxSlide = Math.ceil(this.featuredProducts.length / this.itemsPerView) - 1;
    this.currentSlide = this.currentSlide < maxSlide ? this.currentSlide + 1 : 0;
  }
}
