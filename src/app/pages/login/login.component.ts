import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LocalePipe } from '../../shared/pipes/locale.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, LocalePipe],
  standalone: true,
})
export class LoginComponent {
  private authService = inject(AuthService);

  isLoading = computed(() => this.authService.isLoading());
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  isInitialized = computed(() => this.authService.isInitialized());

  errorMessage = signal<string | null>(null);

  async loginWithAzure(): Promise<void> {
    this.errorMessage.set(null);

    try {
      await this.authService.login();
    } catch (error: any) {
      console.error('Erro no login:', error);

      if (error?.errorCode === 'user_cancelled') {
        this.errorMessage.set('Login cancelado. Tente novamente.');
      } else if (error?.errorCode === 'popup_window_error') {
        this.errorMessage.set(
          'Popup bloqueado. Verifique se o bloqueador de popups está desativado.'
        );
      } else {
        this.errorMessage.set('Erro ao fazer login. Tente novamente.');
      }
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
