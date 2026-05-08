import { Component } from '@angular/core';
import { Dish } from './dish.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  imports: [CommonModule]
})

export class Menu {

 Dishes: Dish[] = [
  {
    id: 1,
    name: 'Caesar Salad',
    category: 'Starter',
    price: 8.99,
    imageUrl: 'https://images.pexels.com/photos/28618643/pexels-photo-28618643.jpeg'
  },
  {
    id: 2,
    name: 'Grilled Chicken',
    category: 'Main Course',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d'
  },
  {
    id: 3,
    name: 'Chocolate Cake',
    category: 'Sweet Dish',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
  },
  {
    id: 4,
    name: 'Lemonade',
    category: 'Drink',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc'
  }
];

  totalItems : number = 4;
  noOfItemsPerPage : number = 2;
  currentPage : number = 1;
  pageSizeOptions: number[] = [2, 4, 6, 8];

  get totalPages(): number {
    return Math.max(Math.ceil(this.Dishes.length / this.noOfItemsPerPage), 1);
  }

  get paginatedDishes(): Dish[]{
    const index = (this.currentPage - 1) * this.noOfItemsPerPage;
    return this.Dishes.slice(index, index + this.noOfItemsPerPage)
  }

  get pageStart(): number {
    return this.Dishes.length === 0 ? 0 : (this.currentPage - 1) * this.noOfItemsPerPage + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.noOfItemsPerPage, this.Dishes.length);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  onNextPage(){
    this.goToPage(this.currentPage + 1);
  }

  onPreviousPage(){
    this.goToPage(this.currentPage - 1);
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    const size = parseInt(value, 10);
    if (size > 0) {
      this.noOfItemsPerPage = size;
      this.goToPage(1);
    }
  }

  ngOnInit(){
     return this.Dishes;
  }
  
}
