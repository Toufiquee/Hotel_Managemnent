import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReservationModel {
  id?: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class ReservationComponent {
  reservation: ReservationModel = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  };

  isSubmitted = false;
  isLoading = false;

  timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '05:00 PM',
    '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM',
    '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  onSubmit() {
    this.isLoading = true;
    
    setTimeout(() => {
      console.log('Reservation submitted:', this.reservation);
      this.isSubmitted = true;
      this.isLoading = false;
    }, 1000);
  }

  makeAnotherReservation() {
    this.isSubmitted = false;
    this.reservation = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    };
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}