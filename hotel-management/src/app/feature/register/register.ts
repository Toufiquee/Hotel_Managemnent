import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrl: './register.css',
  encapsulation: ViewEncapsulation.None
})
export class Register implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = {
        ...this.registerForm.value,
        role: this.registerForm.value.role || 'customer'
      };

      this.registerService.register(payload).subscribe({
        next: (res) => {
          console.log('Success:', res);
          alert('Registration successful');
          this.registerForm.reset({ role: 'customer', terms: false });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert(err?.error?.message || 'Registration failed');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}