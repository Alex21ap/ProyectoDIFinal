import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Users } from '../../../../core/services/users';
import { Courses } from '../../../../core/services/courses';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  private coursesService = inject(Courses);
  private usersService = inject(Users);
  private cd = inject(ChangeDetectorRef);

  userRole: string | null = '';
  userName: string = '';

  courses: any[] = [];
  filteredCourses: any[] = [];
  viewMode: 'none' | 'inscritos' | 'completados' = 'none';

  totalCourses: number = 0;
  totalUsers: number = 0;
  misInscripcionesCount: number = 0;
  isLoading: boolean = true;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userRole = user.role;
      this.userName = user.username || 'Usuario';
    }
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.totalCourses = data.length;

        if (this.userRole === 'ESTUDIANTE') {
          const inscritos = JSON.parse(localStorage.getItem('mis_cursos') || '[]');
          this.misInscripcionesCount = inscritos.length;
        }

        if (this.userRole === 'ADMIN') {
          this.usersService.getUsers().subscribe({
            next: (users) => {
              this.totalUsers = users.length;
              this.finalizeLoading();
            },
            error: () => this.finalizeLoading()
          });
        } else {
          this.finalizeLoading();
        }
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.finalizeLoading();
      }
    });
  }

  private finalizeLoading(): void {
    this.isLoading = false;
    this.cd.detectChanges();
  }

  switchView(mode: 'inscritos'): void {
    if (this.userRole !== 'ESTUDIANTE') return;

    if (this.viewMode === mode) {
      this.viewMode = 'none';
    } else {
      this.viewMode = mode;
      const ids = JSON.parse(localStorage.getItem('mis_cursos') || '[]');
      this.filteredCourses = this.courses.filter((c: any) => ids.includes(c.id));
    }
    this.cd.detectChanges();
  }

  cancelarInscripcion(courseId: number): void {
  if (confirm('¿Estás seguro de que deseas cancelar tu inscripción a este curso?')) {
    let inscritos: number[] = JSON.parse(localStorage.getItem('mis_cursos') || '[]');
    inscritos = inscritos.filter(id => id !== courseId);
    localStorage.setItem('mis_cursos', JSON.stringify(inscritos));
    this.misInscripcionesCount = inscritos.length;
    this.filteredCourses = this.courses.filter((c: any) => inscritos.includes(c.id));
    if (inscritos.length === 0) {
      this.viewMode = 'none';
    }

    this.cd.detectChanges();
    alert('Inscripción cancelada correctamente.');
  }
}

  generarReporte(): void {
    alert('Función de reporte: Generando archivo PDF con el listado de cursos y usuarios...');
  }
}