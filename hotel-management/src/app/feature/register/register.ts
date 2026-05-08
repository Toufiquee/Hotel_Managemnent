import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    CommonModule,          // ✅ for *ngIf
    ReactiveFormsModule    // ✅ for formGroup
  ],
  styleUrl: './register.css',
   encapsulation: ViewEncapsulation.None

})
export class Register implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private registerService: RegisterService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
     if (this.registerForm.valid) {

      this.registerService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Success:', res);
          alert('Registration successful');

          this.registerForm.reset();
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Registration failed');
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}