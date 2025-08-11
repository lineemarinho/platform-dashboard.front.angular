import { Document } from '../interfaces/document.interface';

export class DocumentFormatter {
  static format(document: Document): string {
    return `${document.type}: ${DocumentFormatter.formatNumber(document)}`;
  }

  static formatNumber(document: Document): string {
    if (document.type === 'CPF') {
      return document.number.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    } else if (document.type === 'CNPJ') {
      return document.number.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
    return document.number;
  }
}

export class StatusFormatter {
  static format(active: boolean): string {
    return active ? 'active' : 'inactive';
  }

  static formatWithCustomLabels(
    active: boolean,
    activeLabel = 'active',
    inactiveLabel = 'inactive'
  ): string {
    return active ? activeLabel : inactiveLabel;
  }
}

export class TypeFormatter {
  static translateType(type: string): string {
    switch (type) {
      case 'INDIVIDUAL':
        return 'Pessoa Física';
      case 'ORGANIZATION':
        return 'Pessoa Jurídica';
      default:
        return type;
    }
  }

  static translateCountry(country: string): string {
    switch (country) {
      case 'BRA':
        return 'Brasil';
      case 'PER':
        return 'Peru';
      default:
        return country;
    }
  }
}
