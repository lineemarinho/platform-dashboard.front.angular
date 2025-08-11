import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalePipe } from '../../pipes/locale.pipe';

export interface BalanceCard {
  id: string;
  type: string;
  nickname: string;
  currency: string;
  amount: number;
  flag: string;
  canWithdraw: boolean;
  canEdit: boolean;
}

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [CommonModule, LocalePipe],
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.css'],
})
export class BalanceCardComponent {
  @Input() balance!: BalanceCard;
  @Output() onEditNickname = new EventEmitter<BalanceCard>();
  @Output() onRequestWithdrawal = new EventEmitter<BalanceCard>();
  @Output() onViewStatement = new EventEmitter<BalanceCard>();

  onEditClick(): void {
    console.log('BalanceCard: Editando apelido', this.balance);
    this.onEditNickname.emit(this.balance);
  }

  onWithdrawalClick(): void {
    this.onRequestWithdrawal.emit(this.balance);
  }

  onStatementClick(): void {
    this.onViewStatement.emit(this.balance);
  }

  getCurrencySymbol(currency: string): string {
    switch (currency) {
      case 'BRL':
        return 'R$';
      case 'CLP':
        return 'CLP';
      case 'USDT':
        return 'USDT';
      case 'ARS':
        return 'ARS';
      default:
        return currency;
    }
  }

  getFlagIcon(flag: string): string {
    switch (flag) {
      case 'BR':
        return 'assets/flags/brl.svg';
      case 'CL':
        return 'assets/flags/clp.svg';
      case 'AR':
        return 'assets/flags/ars.svg';
      case 'USDT':
        return 'assets/flags/usd.svg';
      default:
        return 'assets/flags/usd.svg';
    }
  }
} 