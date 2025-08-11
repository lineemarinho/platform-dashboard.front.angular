import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LocalePipe } from '../../pipes/locale.pipe';
import { PageTitleComponent } from '../page-title/page-title.component';

export interface PixAccountInfo {
  balance: string;
  agency: string;
  account: string;
  ispb: string;
  bank: string;
}

@Component({
  selector: 'app-pix-account-info',
  standalone: true,
  imports: [CommonModule, LocalePipe, PageTitleComponent],
  templateUrl: './pix-account-info.component.html',
  styleUrls: ['./pix-account-info.component.css'],
})
export class PixAccountInfoComponent {
  @Input() title: string = '';
  @Input() accountInfo: PixAccountInfo = {
    balance: 'R$ 104.159,94',
    agency: '0001',
    account: '12345678909876543210',
    ispb: '33630661',
    bank: 'GOWD',
  };

  isBalanceVisible = true;

  onCopyAccountInfo(): void {
    const accountData = `Agência: ${this.accountInfo.agency}\nConta: ${this.accountInfo.account}\nISPB: ${this.accountInfo.ispb}\nBanco: ${this.accountInfo.bank}`;
    navigator.clipboard.writeText(accountData);
  }

  toggleBalanceVisibility(): void {
    this.isBalanceVisible = !this.isBalanceVisible;
  }

  get displayBalance(): string {
    return this.isBalanceVisible ? this.accountInfo.balance : '••••••••';
  }
}
