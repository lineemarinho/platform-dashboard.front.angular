import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LocalePipe } from '../../pipes/locale.pipe';
import { AppInputComponent } from '../app-input/app-input.component';

export interface KeyType {
  icon: string;
  label: string;
  placeholder: string;
  mask?: string;
  validator?: RegExp;
}

@Component({
  selector: 'app-pix-key-type-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, LocalePipe],
  templateUrl: './pix-key-type-selector.component.html',
  styleUrls: ['./pix-key-type-selector.component.css'],
})
export class PixKeyTypeSelectorComponent {
  @Input() keyTypes: KeyType[] = [];
  @Input() selectedIndex: number = 0;
  @Output() keyTypeSelected = new EventEmitter<number>();
  @Output() keyValueChanged = new EventEmitter<string>();

  keyInputControl = new FormControl('');

  onKeyTypeSelect(index: number): void {
    this.selectedIndex = index;
    this.keyTypeSelected.emit(index);

    this.keyInputControl.setValue('');
    this.keyValueChanged.emit('');
  }

  onKeyInput(event: any): void {
    let value = event.target.value;
    const keyType = this.keyTypes[this.selectedIndex];

    value = this.formatValue(value, keyType);

    this.keyInputControl.setValue(value);
    this.keyValueChanged.emit(value);
  }

  private formatValue(value: string, keyType: KeyType): string {
    switch (keyType.label) {
      case 'cpfCnpj':
        return this.formatCPFCNPJ(value);
      case 'mobile':
        return this.formatPhone(value);
      case 'email':
        return value.toLowerCase();
      case 'randomKey':
        return value.toUpperCase();
      case 'copyPaste':
        return value;
      default:
        return value;
    }
  }

  private formatCPFCNPJ(value: string): string {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return cleanValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
  }

  private formatPhone(value: string): string {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length <= 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  get currentKeyType(): KeyType {
    return this.keyTypes[this.selectedIndex] || this.keyTypes[0];
  }
}
