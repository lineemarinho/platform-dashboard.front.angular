import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoadingComponent {
  @Input() message: string = 'Carregando...';
  @Input() showSpinner: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'card' | 'inline' = 'default';
}
