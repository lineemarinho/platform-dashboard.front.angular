import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const expireGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenExpired()) {
    const refreshed = await authService.refreshTokenIfNeeded();

    if (!refreshed) {
      sessionStorage.setItem("originalUrl", router.url);
      router.navigate(["/login"]);
      return false;
    }
  }

  return true;
};
