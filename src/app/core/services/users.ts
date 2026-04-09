import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private http = inject(HttpClient);
  
  private readonly API_URL = `${environment.apiUrl}/users`;

  /**
   * Obtener todos los usuarios de la academia
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  /**
   * Crear un nuevo usuario
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  /**
   * Actualizar datos de un usuario
   */
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user);
  }

  /**
   * Eliminar un usuario de la base de datos
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}