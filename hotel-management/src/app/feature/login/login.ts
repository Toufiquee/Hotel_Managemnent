import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = false;

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      if (!this.email() || !this.password()) {
        this.errorMessage.set('Please fill in all fields');
        this.isLoading.set(false);
        return;
      }

      console.log('Login attempt:', { email: this.email(), rememberMe: this.rememberMe() });
      this.isLoading.set(false);
    }, 1000);
  }

  clearError() {
    this.errorMessage.set('');
  }
}