import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalePipe } from '../../../../shared/pipes';

export interface ReceiptData {
  transactionId: string;
  authenticationCode: string;
  transferValue: number;
  transactionDate: Date;
  beneficiary: string;
  key: string;
  bank: string;
  reason: string;
  originName: string;
  originAgency: string;
  originAccount: string;
  originBank: string;
}

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, LocalePipe],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent {
  @Input() isOpen = false;
  @Input() receiptData: ReceiptData | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
