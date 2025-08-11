import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, OverlayModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public authService: AuthService) {}

  protected readonly title = signal('partner-platform-dashboard.front.angular');
}
