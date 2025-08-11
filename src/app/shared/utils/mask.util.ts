import { DocumentType } from "../enums";

export class MaskUtil {
  static applyDocumentMask(value: string, documentType: string): string {
    if (!value) return value;

    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    switch (documentType) {
      case DocumentType.CPF:
        return this.applyCPFMask(numbers);
      case DocumentType.CNPJ:
        return this.applyCNPJMask(numbers);
      case DocumentType.RG:
        return this.applyRGMask(numbers);
      case DocumentType.PASSPORT:
        return numbers; // Passaporte não tem máscara específica
      default:
        return numbers;
    }
  }

  private static applyCPFMask(value: string): string {
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length <= 9)
      return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
      6,
      9
    )}-${value.slice(9, 11)}`;
  }

  private static applyCNPJMask(value: string): string {
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
    if (value.length <= 8)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    if (value.length <= 12)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
        5,
        8
      )}/${value.slice(8)}`;
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
  }

  private static applyRGMask(value: string): string {
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
    if (value.length <= 8)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}-${value.slice(8)}`;
  }

  static removeMask(value: string): string {
    return value.replace(/\D/g, "");
  }
}
