import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { getApiUrl } from "../../shared/utils/organization-auth.util";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const apiUrl = getApiUrl();

  if (request.url.startsWith(apiUrl)) {
    const token = authService.getAccessTokenForAPI();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
      }

      return throwError(() => error);
    })
  );
};
