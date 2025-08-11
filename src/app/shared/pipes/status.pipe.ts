import { Pipe, PipeTransform } from '@angular/core';
import { StatusFormatter } from '../utils/formatters.util';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(
    active: boolean,
    activeLabel = 'active',
    inactiveLabel = 'inactive'
  ): string {
    return StatusFormatter.formatWithCustomLabels(
      active,
      activeLabel,
      inactiveLabel
    );
  }
}
