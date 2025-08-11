import { Pipe, PipeTransform } from '@angular/core';
import { Document } from '../interfaces/document.interface';
import { DocumentFormatter } from '../utils/formatters.util';

@Pipe({
  name: 'document',
  standalone: true,
})
export class DocumentPipe implements PipeTransform {
  transform(document: Document, format: 'full' | 'number' = 'full'): string {
    if (format === 'number') {
      return DocumentFormatter.formatNumber(document);
    }
    return DocumentFormatter.format(document);
  }
} 