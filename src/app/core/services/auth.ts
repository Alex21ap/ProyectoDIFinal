import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * 1. Método para hacer login real
   * Envía las credenciales al backend y recibe el JWT + Datos del usuario
   */
  login(username: string, password: string): Observable<AuthResponse> {
    const credentials = { username, password };
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        // Si el backend responde con éxito, guardamos la sesión automáticamente
        this.setSession(res);
      })
    );
  }

  /**
   * 2. Guardar el Token y datos necesarios en el navegador
   */
  private setSession(authResult: AuthResponse) {
    localStorage.setItem('token', authResult.token);
    // Guardamos también el rol para la carga dinámica de componentes
    localStorage.setItem('user_role', authResult.user.role);
    // Es recomendable guardar el usuario completo si lo necesitas para el perfil
    localStorage.setItem('user_data', JSON.stringify(authResult.user));
  }

  /**
   * 3. Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
  }

  /**
   * 4. Verificar si está logueado (Para el AuthGuard)
   */
  isLoggedIn(): boolean {
    // Un token presente suele indicar que hay sesión, 
    // aunque lo ideal es que el interceptor maneje si el token expiró.
    return !!localStorage.getItem('token');
  }

  /**
   * 5. Obtener el rol del usuario guardado (Para el RoleGuard)
   */
  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  /**
   * 6. Obtener el token para el Interceptor
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}