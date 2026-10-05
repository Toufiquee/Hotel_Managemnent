import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = false;

  onSubmit() {

    if (!this.email() || !this.password()) {
      this.errorMessage.set("Please fill in all fields");
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const loginData = {
      email: this.email(),
      password: this.password()
    };

    this.authService.login(loginData).subscribe({

      next: (response) => {
        this.authService.setAuthState(response?.token, response?.user);
        this.isLoading.set(false);

        const role = response?.user?.role || response?.user?.Role || '';
        this.router.navigate([role?.toString().toLowerCase() === 'admin' ? '/admin' : '/landing']);
      },

      error: (err) => {

        this.isLoading.set(false);

        if (err.status === 401) {
          this.errorMessage.set("Invalid Email or Password");
        } else {
          this.errorMessage.set("Something went wrong.");
        }
      }

    });

  }

  clearError() {
    this.errorMessage.set('');
  }

}