export interface Dish{

  id: number;
  name: string;
  category: 'Starter' | 'Main Course' | 'Sweet Dish' | 'Drink';
  price: number;
  imageUrl: string;
}