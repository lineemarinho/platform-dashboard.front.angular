import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RefundsService } from '../../core/services/refunds.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';
import { AppTableComponent } from '../../shared/components/app-table/app-table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Refund } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalePipe,
    AppTableComponent,
    PaginationComponent,
    PageTitleComponent,
    LoadingComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectComponent,
  ],
  templateUrl: './refunds.component.html',
  styleUrl: './refunds.component.css',
})
export class RefundsComponent implements OnInit {
  isLoading = false;
  refunds = signal<Refund[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: 'id', label: 'ID', type: 'id' as const },
    { key: 'orderId', label: 'Order ID', type: 'id' as const },
    { key: 'company', label: 'Company', type: 'text' as const },
    { key: 'provider', label: 'Provider', type: 'text' as const },
    { key: 'channel', label: 'Channel', type: 'text' as const },
    { key: 'requester', label: 'Requester', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'status' as const },
    { key: 'amount', label: 'Amount', type: 'money' as const },
    { key: 'reason', label: 'Reason', type: 'text' as const },
    { key: 'createdAt', label: 'Created At', type: 'date' as const },

  ];

  constructor(
    private refundsService: RefundsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      orderId: [''],
      company: [''],
      provider: [''],
      channel: [''],
      requester: [''],
      status: [''],
      reason: [''],
    });
  }

  ngOnInit(): void {
    this.loadRefunds();
  }

  get tableRows() {
    return this.refunds();
  }

  mapRowToColumns = (refund: Refund) => [
    refund.id,
    refund.order?.id || 'N/A',
    refund.order?.company?.name || 'N/A',
    refund.provider,
    refund.channel,
    refund.requester?.name || 'N/A',
    refund.status,
    `${refund.order?.amount?.currency || 'N/A'} ${
      refund.order?.amount?.value || 'N/A'
    }`,
    refund.reason,
    refund.createdAt
      ? new Date(refund.createdAt).toLocaleDateString('pt-BR')
      : 'N/A',
  ];

  onViewDetails(refund: Refund): void {
    console.log('Ver detalhes do refund:', refund);
    // Implementar navegação para detalhes
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadRefunds();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadRefunds();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  onFilterAndClose(): void {
    this.onFilter();
    this.isMobileFiltersOpen = false;
  }

  onClearAndClose(): void {
    this.onClear();
    this.isMobileFiltersOpen = false;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterForm.value).some(
      (value) => value !== '' && value !== null
    );
  }

  getActiveFiltersCount(): number {
    return Object.values(this.filterForm.value).filter(
      (value) => value !== '' && value !== null
    ).length;
  }

  get paginationInfo() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      totalPages,
      hasNextPage: this.currentPage < totalPages,
      hasPreviousPage: this.currentPage > 1,
    };
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRefunds();
  }

  loadRefunds(): void {
    console.log('Iniciando carregamento de refunds...');
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log('Parâmetros:', { skip, take });

    this.refundsService.getRefunds(skip, take).subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.refunds.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log('Loading finalizado, dados:', this.refunds());
      },
      error: (error) => {
        console.error('Erro ao carregar refunds:', error);
        this.isLoading = false;
      },
    });
  }
}
