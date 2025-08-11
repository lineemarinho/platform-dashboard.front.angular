import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(
    'AuthGuard executando - isAuthenticated:',
    authService.isAuthenticated()
  );

  if (!authService.isAuthenticated()) {
    console.log('Usuário não autenticado, redirecionando para login');

    sessionStorage.setItem('originalUrl', router.url);
    router.navigate(['/login']);
    return false;
  }

  if (authService.isTokenExpired()) {
    console.log('Token expirado, tentando renovar...');
    const refreshed = await authService.refreshTokenIfNeeded();

    if (!refreshed) {
      console.log('Falha ao renovar token, redirecionando para login');
      sessionStorage.setItem('originalUrl', router.url);
      router.navigate(['/login']);
      return false;
    }
  }

  console.log('AuthGuard: Acesso permitido');
  return true;
};
