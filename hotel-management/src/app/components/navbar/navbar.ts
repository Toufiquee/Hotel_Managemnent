import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartIcon } from '../cart-icon/cart-icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, CartIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authSubscription?: Subscription;

  isLoggedIn = false;
  userName = 'User';
  userInitials = 'U';
  showDropdown = false;
  isAdmin = false;

  ngOnInit(): void {
    this.syncAuthState();
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      this.syncAuthState();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private syncAuthState(): void {
    const storedUser = localStorage.getItem('user');

    this.isLoggedIn = this.authService.isLoggedIn();

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userName = user?.name || user?.fullName || user?.email || 'User';
        this.isAdmin = (user?.role || user?.Role || '').toString().toLowerCase() === 'admin';
      } catch {
        this.userName = 'User';
        this.isAdmin = false;
      }
    } else {
      this.userName = 'User';
      this.isAdmin = false;
    }

    this.userInitials = this.getInitials(this.userName);
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('');
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    this.authService.clearAuthState();
    this.syncAuthState();
    this.closeDropdown();
    this.router.navigate(['/landing']);
  }
}
