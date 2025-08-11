import { NgIf } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

interface BrandConfig {
  name: string;
  primary: string;
  secondary: string;
  text: string;
}

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() icon?: string;
  @Input() label?: string;
  @Input() fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base';

  value: string = '';
  disabled: boolean = false;
  inputId = 'input-' + Math.random().toString(36).substr(2, 9);

  get brandConfig(): BrandConfig {
    const port = window.location.port;
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      switch (port) {
        case '4200':
          return {
            name: 'Gowd',
            primary: 'focus:ring-blue-500',
            secondary: 'bg-orange-500',
            text: 'text-white',
          };
        case '4210':
          return {
            name: 'Zimba',
            primary: 'focus:ring-purple-500',
            secondary: 'bg-purple-500',
            text: 'text-white',
          };
        case '4220':
          return {
            name: 'SulPayments',
            primary: 'focus:ring-blue-400',
            secondary: 'bg-blue-400',
            text: 'text-white',
          };
        default:
          return {
            name: 'Gowd',
            primary: 'focus:ring-blue-500',
            secondary: 'bg-orange-500',
            text: 'text-white',
          };
      }
    }

    return {
      name: 'Gowd',
      primary: 'focus:ring-blue-500',
      secondary: 'bg-orange-500',
      text: 'text-white',
    };
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
