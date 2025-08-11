import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PaginationComponent {
  @Input() paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  @Input() showInfo = true;
  @Input() showPageNumbers = true;
  @Input() maxPageNumbers = 5;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return (
      (this.paginationInfo.currentPage - 1) * this.paginationInfo.itemsPerPage +
      1
    );
  }

  get endItem(): number {
    return Math.min(
      this.paginationInfo.currentPage * this.paginationInfo.itemsPerPage,
      this.paginationInfo.totalItems
    );
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const { currentPage, totalPages } = this.paginationInfo;
    const maxPageNumbers = this.maxPageNumbers;

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

  onPageChange(page: number): void {
    if (
      page >= 1 &&
      page <= this.paginationInfo.totalPages &&
      page !== this.paginationInfo.currentPage
    ) {
      this.pageChange.emit(page);
    }
  }

  onPreviousPage(): void {
    if (this.paginationInfo.hasPreviousPage) {
      this.onPageChange(this.paginationInfo.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.paginationInfo.hasNextPage) {
      this.onPageChange(this.paginationInfo.currentPage + 1);
    }
  }

  onFirstPage(): void {
    this.onPageChange(1);
  }

  onLastPage(): void {
    this.onPageChange(this.paginationInfo.totalPages);
  }
}
