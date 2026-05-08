import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews {
  reviews: Review[] = [
    { id: 1, name: 'Sarah Johnson', rating: 5, comment: 'Absolutely amazing experience! The food was exceptional and the service was impeccable. Will definitely come back!', date: '2024-01-15' },
    { id: 2, name: 'Michael Chen', rating: 5, comment: 'Best restaurant in town. The ambiance is perfect for both family dinners and date nights.', date: '2024-01-10' },
    { id: 3, name: 'Emily Davis', rating: 4, comment: 'Great food and friendly staff. The menu has so many delicious options to choose from.', date: '2024-01-05' },
    { id: 4, name: 'James Wilson', rating: 5, comment: 'Outstanding dining experience! Every dish was a masterpiece. Highly recommend the chef special!', date: '2023-12-28' },
    { id: 5, name: 'Lisa Anderson', rating: 5, comment: 'Perfect celebration spot! We had our anniversary dinner here and it was unforgettable.', date: '2023-12-20' },
    { id: 6, name: 'Robert Taylor', rating: 4, comment: 'Excellent food quality. The reservations system works great - never had to wait for a table.', date: '2023-12-15' }
  ];

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0).map((_, i) => i);
  }
}