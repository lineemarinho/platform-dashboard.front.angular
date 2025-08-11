import { NgIf } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopHeaderComponent } from './top-header/top-header.component';

@Component({
  selector: 'app-layout',
  imports: [NgIf, RouterOutlet, SidebarComponent, TopHeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isDarkMode = false;

  isLoginLayout = computed(() => {
    return !this.authService.isAuthenticated() || this.router.url === '/login';
  });

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode = true;
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'theme') {
        this.isDarkMode = event.newValue === 'dark';
      }
    });
  }
}
