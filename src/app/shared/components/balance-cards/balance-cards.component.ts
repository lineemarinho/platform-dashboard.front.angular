import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalePipe } from '../../pipes';

export interface BalanceCard {
  id: string;
  currency: string;
  amount: string;
  icon: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-balance-cards',
  templateUrl: './balance-cards.component.html',
  styleUrls: ['./balance-cards.component.css'],
  standalone: true,
  imports: [CommonModule, LocalePipe],
})
export class BalanceCardsComponent {
  @Input() cards: BalanceCard[] = [];
  @Input() selectedCardId: string = '';
  @Output() cardSelected = new EventEmitter<string>();

  onCardClick(cardId: string): void {
    this.selectedCardId = cardId;
    this.cardSelected.emit(cardId);
  }

  isCardActive(cardId: string): boolean {
    return this.selectedCardId === cardId;
  }
}
