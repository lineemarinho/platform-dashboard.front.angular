import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const apiUrl =
    environment.azureAD.auth.gowd.api.host +
    environment.azureAD.auth.gowd.api.context;

  if (request.url.startsWith(apiUrl)) {
    const token = authService.getAccessTokenForAPI();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('🔧 Interceptor: Token do Azure AD adicionado');
    } else {
      console.log('🔧 Interceptor: Token não encontrado, usando fallback');
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('🔒 Erro 401 - Token inválido ou expirado');
        console.log('📋 URL da requisição:', request.url);
      }

      return throwError(() => error);
    })
  );
};
