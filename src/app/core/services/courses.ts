import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Courses {
  private http = inject(HttpClient);
  
  private readonly API_URL = `${environment.apiUrl}/courses`;

  constructor() { }

  /**
   * Obtener todos los cursos del backend real
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API_URL);
  }

  /**
   * Obtener un solo curso por ID
   */
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear un nuevo curso
   */
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.API_URL, course);
  }

  /**
   * Actualizar un curso existente
   */
  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.API_URL}/${id}`, course);
  }

  /**
   * Eliminar un curso
   */
  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}