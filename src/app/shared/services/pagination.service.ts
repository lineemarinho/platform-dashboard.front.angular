import { Injectable } from '@angular/core';
import { PaginationInfo } from '../components/pagination/pagination.component';

export interface PaginationConfig {
  itemsPerPage: number;
  maxPageNumbers?: number;
}

export interface PaginationRequest {
  skip: number;
  take: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private defaultConfig: PaginationConfig = {
    itemsPerPage: 20,
    maxPageNumbers: 5,
  };

  /**
   * Calcula o skip baseado na página atual e itens por página
   */
  calculateSkip(page: number, itemsPerPage: number): number {
    return (page - 1) * itemsPerPage;
  }

  /**
   * Calcula o número total de páginas
   */
  calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }

  /**
   * Cria um objeto de requisição com parâmetros de paginação
   */
  createPaginationRequest(
    page: number,
    itemsPerPage: number,
    additionalParams: Record<string, any> = {}
  ): PaginationRequest {
    return {
      skip: this.calculateSkip(page, itemsPerPage),
      take: itemsPerPage,
      ...additionalParams,
    };
  }

  /**
   * Cria um objeto PaginationInfo baseado nos dados fornecidos
   */
  createPaginationInfo(
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ): PaginationInfo {
    const totalPages = this.calculateTotalPages(totalItems, itemsPerPage);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  /**
   * Valida se uma página é válida
   */
  isValidPage(page: number, totalPages: number): boolean {
    return page >= 1 && page <= totalPages;
  }

  /**
   * Obtém o range de itens sendo exibidos
   */
  getItemRange(
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ): {
    start: number;
    end: number;
  } {
    const start = this.calculateSkip(currentPage, itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return { start, end };
  }

  /**
   * Gera um array de números de páginas para exibição
   */
  generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxPageNumbers: number = 5
  ): number[] {
    const pages: number[] = [];

    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
      let end = Math.min(totalPages, start + maxPageNumbers - 1);

      if (end - start + 1 < maxPageNumbers) {
        start = Math.max(1, end - maxPageNumbers + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
