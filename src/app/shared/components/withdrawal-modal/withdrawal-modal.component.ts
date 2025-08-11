import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalePipe } from '../../pipes/locale.pipe';
import { AppButtonComponent } from '../app-button/app-button.component';
import { AppInputComponent } from '../app-input/app-input.component';

export interface WithdrawalData {
  currency: string;
  amount: number;
  flag: string;
  availableTypes: string[];
}

export interface WithdrawalRequest {
  type: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-withdrawal-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    LocalePipe,
  ],
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['./withdrawal-modal.component.css'],
})
export class WithdrawalModalComponent {
  @Input() isOpen = false;
  @Input() data: WithdrawalData | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onRequest = new EventEmitter<WithdrawalRequest>();

  form: FormGroup;
  selectedType = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      value: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.availableTypes.length > 0) {
      this.selectedType = this.data.availableTypes[0];
    }
  }

  onCloseClick(): void {
    this.onClose.emit();
  }

  onRequestClick(): void {
    if (this.form.valid && this.selectedType) {
      const request: WithdrawalRequest = {
        type: this.selectedType,
        value: this.form.get('value')?.value,
        description: this.form.get('description')?.value,
      };
      this.onRequest.emit(request);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCloseClick();
    }
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
