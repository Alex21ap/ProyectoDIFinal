import { Component, inject, OnInit } from '@angular/core';
import { Courses } from '../../../../core/services/courses';
import { Course } from '../../../../core/models/course.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private coursesService = inject(Courses);

  isEditing = false;
  isLoading = true;
  courses: Course[] = [];

  selectedCourse: any = { 
    id: null, 
    nombre: '', 
    instructor: '', 
    duracion: '', 
    descripcion: '' 
  };

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.isLoading = false;
      }
    });
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
          this.closeModalAndReset('Curso actualizado correctamente');
        },
        error: (err) => alert('Error al actualizar en el servidor')
      });
    } else {
      // --- CREAR (POST) ---
      // No generamos ID manual, el backend se encarga
      this.coursesService.createCourse(this.selectedCourse).subscribe({
        next: (newCourse) => {
          this.courses.push(newCourse);
          this.closeModalAndReset('Curso creado con éxito');
        },
        error: (err) => alert('Error al crear el curso en el servidor')
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
        },
        error: () => {
          this.courses = this.courses.filter(c => c.id !== id);
          console.warn('Eliminado localmente por error de red.');
        }
      });
    }
  }
}