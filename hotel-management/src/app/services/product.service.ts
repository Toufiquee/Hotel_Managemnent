import { Injectable } from '@angular/core';
import { Product } from './cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5038/api/products';

  constructor( private http : HttpClient){ }

  private products: Product[] = [
    // { id: 1, name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herbs and lemon butter sauce', price: 24.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'Main Course' },
    // { id: 2, name: 'Beef Tenderloin', description: 'Premium beef tenderloin with red wine reduction', price: 34.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Main Course' },
    // { id: 3, name: 'Caesar Salad', description: 'Crisp romaine lettuce with homemade Caesar dressing', price: 12.99, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category: 'Starters' },
    // { id: 4, name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms', price: 18.99, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5bd371?w=400', category: 'Main Course' },
    // { id: 5, name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 6.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', category: 'Starters' },
    // { id: 6, name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone', price: 9.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: 'Desserts' },
    // { id: 7, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 11.99, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category: 'Desserts' },
    // { id: 8, name: 'House Wine (Glass)', description: 'Selection of red or white house wine', price: 8.99, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', category: 'Beverages' },
  ];

  // getProducts(): Product[] {
  //   return this.products;
  // }
  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<Product[]>(this.apiUrl, { headers });
  }

  createProduct(product: Partial<Product>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post(this.apiUrl, product, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  getCategories(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
  
}