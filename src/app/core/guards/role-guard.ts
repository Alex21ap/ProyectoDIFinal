import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  
  // Obtenemos el rol esperado de la configuración de la ruta
  const expectedRole = route.data['expectedRole'];
  const userRole = authService.getRole();

  if (authService.isLoggedIn() && userRole === expectedRole) {
    return true;
  }

  alert('No tienes permisos para acceder a esta sección');
  router.navigate(['/dashboard']);
  return false;
};