import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {
  team = [
    { name: 'John Smith', role: 'Head Chef', image: '👨‍🍳', bio: '20+ years of culinary expertise' },
    { name: 'Maria Garcia', role: 'Restaurant Manager', image: '👩‍💼', bio: 'Dedicated to excellent service' },
    { name: 'David Chen', role: 'Sous Chef', image: '👨‍🍳', bio: 'Specialist in Asian fusion' }
  ];
}