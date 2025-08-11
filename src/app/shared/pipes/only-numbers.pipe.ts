import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyNumbers',
  standalone: true,
})
export class OnlyNumbersPipe implements PipeTransform {
  transform(value: string): any {
    return value.replace(/\D/g, '');
  }
}
