import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  userRole: string | null = '';

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role;
  }
}
