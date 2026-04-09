import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Users } from '../../../../core/services/users';
import { Courses } from '../../../../core/services/courses';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.html'
})
export class DashboardHome implements OnInit {
  private coursesService = inject(Courses);
  private usersService = inject(Users);

  usuarios: any[] = [];

  totalCourses: number = 0;
  totalUsers: number = 0;

  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.totalUsers = data.length;
      },
      error: (err) => {
        // Este error ya no debería salir porque estamos usando datos falsos
        console.error("Error cargando usuarios", err);
      }
    });
    this.coursesService.getCourses().subscribe(data => this.totalCourses = data.length);
  }

  loadStats(): void {
    // Obtenemos el conteo de cursos
    this.coursesService.getCourses().subscribe(data => this.totalCourses = data.length);
    
    // Obtenemos el conteo de usuarios
    this.usersService.getUsers().subscribe(data => this.totalUsers = data.length);
  }

  generarReporte(): void {
    alert('Función de reporte: Generando archivo PDF con el listado de cursos y usuarios...');
    // Aquí podrías implementar una librería como jspdf en el futuro
  }
}