import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PayinsService } from '../../core/services/payins.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';
import { AppTableComponent } from '../../shared/components/app-table/app-table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Payin } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';

@Component({
  selector: 'app-payins',
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
  templateUrl: './payins.component.html',
  styleUrl: './payins.component.css',
})
export class PayinsComponent implements OnInit {
  isLoading = false;
  payins = signal<Payin[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: 'id', label: 'ID', type: 'id' as const },
    { key: 'code', label: 'Code', type: 'id' as const },
    { key: 'status', label: 'Status', type: 'status' as const },
    { key: 'company', label: 'Company', type: 'text' as const },
    { key: 'customer', label: 'Customer', type: 'text' as const },
    { key: 'paymentMethod', label: 'Payment Method', type: 'text' as const },
    { key: 'amount', label: 'Amount', type: 'money' as const },
    {
      key: 'financialPartner',
      label: 'Financial Partner',
      type: 'text' as const,
    },
    { key: 'origin', label: 'Origin', type: 'text' as const },
    { key: 'createdAt', label: 'Created At', type: 'date' as const },
  ];

  constructor(
    private payinsService: PayinsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      code: [''],
      status: [''],
      company: [''],
      customer: [''],
      paymentMethod: [''],
      financialPartner: [''],
      origin: [''],
    });
  }

  ngOnInit(): void {
    this.loadPayins();
  }

  get tableRows() {
    return this.payins();
  }

  mapRowToColumns = (payin: Payin) => {
    const createdAt = payin.createdAt
      ? new Date(payin.createdAt).toLocaleDateString('pt-BR')
      : 'N/A';

    console.log('Payin createdAt:', payin.createdAt, 'Formatted:', createdAt);

    return [
      payin.id,
      payin.code,
      payin.status,
      payin.company?.name || 'N/A',
      payin.customer?.fullName || 'N/A',
      payin.paymentMethod,
      `${payin.amount?.currency || 'N/A'} ${payin.amount?.value || 'N/A'}`,
      payin.financialPartner || 'N/A',
      payin.origin || 'N/A',
      createdAt,
    ];
  };

  onViewDetails(payin: Payin): void {
    console.log('=== onViewDetails chamado ===');
    console.log('Payin:', payin);
    console.log('Navegando para: /payins/details');

    this.router.navigate(['/payins/details']).then(
      (success) => {
        console.log('Navegação bem-sucedida:', success);
      },
      (error) => {
        console.error('Erro na navegação:', error);
      }
    );
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadPayins();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadPayins();
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
    this.loadPayins();
  }

  loadPayins(): void {
    console.log('Iniciando carregamento de payins...');
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log('Parâmetros:', { skip, take });

    this.payinsService.getPayins(skip, take).subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.payins.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log('Loading finalizado, dados:', this.payins());
      },
      error: (error) => {
        console.error('Erro ao carregar payins:', error);
        this.isLoading = false;
      },
    });
  }
}
