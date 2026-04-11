import { Component, inject } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  // 3. Crear un objeto para vincular con el formulario
  credentials = {
    username: '',
    password: ''
  };

  isLoading = false;

  onLogin() {
    this.isLoading = true;

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isLoading = false;
        
        // Guardamos el token para que los interceptores lo usen
        localStorage.setItem('token', response.token);
        
        // Guardamos el objeto usuario completo (incluye el rol)
        localStorage.setItem('user', JSON.stringify(response.user));

        this.router.navigate(['/dashboard/home']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error en las credenciales. Revisa tu usuario o contraseña.');
        console.error(err);
      }
    });
  }
}