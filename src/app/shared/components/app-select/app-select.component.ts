import { NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectComponent),
      multi: true,
    },
  ],
})
export class AppSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = '';
  @Input() fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base';
  @Input() set label(value: string | undefined) {
    this._label = value;
  }
  get label(): string | undefined {
    return this._label;
  }
  private _label?: string;
  @Output() change = new EventEmitter<string>();

  value: string = '';
  disabled: boolean = false;
  inputId = 'select-' + Math.random().toString(36).substr(2, 9);

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

  onSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.change.emit(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
