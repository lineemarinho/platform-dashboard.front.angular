import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface BrandConfig {
  name: string;
  primary: string;
  secondary: string;
  text: string;
}

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class AppButtonComponent {
  @Input() type: 'primary' | 'outline' = 'primary';
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Output() click = new EventEmitter<void>();

  get brandConfig(): BrandConfig {
    const port = window.location.port;
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      switch (port) {
        case '4200':
          return {
            name: 'Gowd',
            primary: 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500',
            secondary: 'bg-orange-500',
            text: 'text-white',
          };
        case '4210':
          return {
            name: 'Zimba',
            primary: 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500',
            secondary: 'bg-purple-500',
            text: 'text-white',
          };
        case '4220':
          return {
            name: 'SulPayments',
            primary: 'bg-blue-900 hover:bg-blue-800 focus:ring-blue-500',
            secondary: 'bg-blue-400',
            text: 'text-white',
          };
        default:
          return {
            name: 'Gowd',
            primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            secondary: 'bg-orange-500',
            text: 'text-white',
          };
      }
    }

    return {
      name: 'Gowd',
      primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-orange-500',
      text: 'text-white',
    };
  }

  get buttonClasses(): string {
    const baseClasses =
      'px-4 py-2 rounded-md font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    let typeClasses = '';
    if (this.type === 'primary') {
      typeClasses = `${this.brandConfig.primary} text-white`;
    } else {
      typeClasses =
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500';
    }

    return `${baseClasses} ${typeClasses} ${this.customClass}`.trim();
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}
