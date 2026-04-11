import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Courses } from '../../../../core/services/courses';
import { Course } from '../../../../core/models/course.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Users } from '../../../../core/services/users';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private coursesService = inject(Courses);
  private usersService = inject(Users);
  private cd = inject(ChangeDetectorRef);

  isEditing = false;
  isLoading = true;
  courses: Course[] = [];
  profesores: any[] = [];
  userRole: string | null = '';

  selectedCourse: any = { 
    id: null, 
    nombre: '', 
    instructor: '', 
    duracion: '', 
    descripcion: '' 
  };

  ngOnInit(): void {

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userRole = user.role;
    }

    this.loadCourses();

    if (this.userRole === 'ADMIN' || this.userRole === 'PROFESOR') {
    this.loadProfesores();
    }
  }

  loadProfesores(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        // Filtro para los usuarios con rol PROFESOR
        this.profesores = users.filter(u => u.role === 'PROFESOR');
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error cargando profesores', err)
    });
  }

  loadCourses(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.coursesService.getCourses().subscribe({
        next: (data) => {
          this.courses = data;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar cursos', err);
          this.isLoading = false;
          this.cd.detectChanges();

        }
      });
    }, 1000);
  }

  estaInscrito(courseId: number | undefined): boolean {
    if (!courseId) return false;

    // 1. Leemos la lista de IDs inscritos desde el localStorage
    const inscritos = JSON.parse(localStorage.getItem('mis_cursos') || '[]');

    // 2. Comprobamos si el ID de este curso está en esa lista
    return inscritos.includes(courseId);
  }

  inscribir(course: Course): void {
    const inscritos = JSON.parse(localStorage.getItem('mis_cursos') || '[]');

    if (!inscritos.includes(course.id)) {
      inscritos.push(course.id);
      localStorage.setItem('mis_cursos', JSON.stringify(inscritos));
      
      // Feedback visual
      alert(`¡Genial! Te has inscrito a: ${course.nombre}`);
      
      this.cd.detectChanges();
    }
  }

  prepareNewCourse(): void {
    this.isEditing = false;
    this.selectedCourse = { id: null, nombre: '', instructor: '', duracion: '', descripcion: '' };
  }

  editCourse(course: Course): void {
    this.isEditing = true;
    this.selectedCourse = { ...course };
  }

  saveCourse(event: Event): void {
    event.preventDefault();

    if (this.isEditing) {
      // --- ACTUALIZAR (PUT) ---
      this.coursesService.updateCourse(this.selectedCourse.id, this.selectedCourse).subscribe({
        next: (updatedCourse) => {
          const index = this.courses.findIndex(c => c.id === updatedCourse.id);
          if (index !== -1) {
            this.courses[index] = updatedCourse;
          }
          this.cd.detectChanges();
          this.closeModalAndReset('Curso actualizado correctamente');
        },
        error: (err) => {
          alert('Error al actualizar en el servidor');
          this.cd.detectChanges();
        }
      });
    } else {
      // --- CREAR (POST) ---
      this.coursesService.createCourse(this.selectedCourse).subscribe({
        next: (newCourse) => {
          this.courses.push(newCourse);
          this.cd.detectChanges();
          this.closeModalAndReset('Curso creado con éxito');
        },
        error: (err) => {
          alert('Error al crear el curso en el servidor');
          this.cd.detectChanges();
        }
      });
    }
  }

  // Función auxiliar para limpiar el código
  private closeModalAndReset(message: string): void {
    alert(message);
    document.getElementById('closeModal')?.click();
    this.prepareNewCourse();
  }

  deleteCourse(id: number | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c.id !== id);
          this.cd.detectChanges();
        },
        error: () => {
          this.courses = this.courses.filter(c => c.id !== id);
          this.cd.detectChanges();
          console.warn('Eliminado localmente por error de red.');
        }
      });
    }
  }
}