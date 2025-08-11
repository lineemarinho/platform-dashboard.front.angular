import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastConfig } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent {
  @Input() config: ToastConfig = {
    message: '',
    type: 'info',
    duration: 3000
  };

  getIcon(): string {
    switch (this.config.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  getClasses(): string {
    const baseClasses = 'flex items-center p-4 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out';
    
    switch (this.config.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border border-yellow-200 text-yellow-800`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  }
} 