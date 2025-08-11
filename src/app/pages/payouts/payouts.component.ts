import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PayoutsService } from '../../core/services/payouts.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';
import { AppTableComponent } from '../../shared/components/app-table/app-table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Payout } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';

@Component({
  selector: 'app-payouts',
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
  templateUrl: './payouts.component.html',
  styleUrl: './payouts.component.css',
})
export class PayoutsComponent implements OnInit {
  isLoading = false;
  payouts = signal<Payout[]>([]);
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
    { key: 'senderAccount', label: 'Sender Account', type: 'text' as const },
    {
      key: 'receiverAccount',
      label: 'Receiver Account',
      type: 'text' as const,
    },
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
    private payoutsService: PayoutsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      code: [''],
      status: [''],
      company: [''],
      senderAccount: [''],
      receiverAccount: [''],
      paymentMethod: [''],
      financialPartner: [''],
      origin: [''],
    });
  }

  ngOnInit(): void {
    this.loadPayouts();
  }

  get tableRows() {
    return this.payouts();
  }

  mapRowToColumns = (payout: Payout) => {
    const createdAt = payout.createdAt
      ? new Date(payout.createdAt).toLocaleDateString('pt-BR')
      : 'N/A';

    console.log('Payout createdAt:', payout.createdAt, 'Formatted:', createdAt);

    return [
      payout.id,
      payout.code,
      payout.status,
      payout.company?.name || 'N/A',
      payout.senderAccount?.fullName || 'N/A',
      payout.receiverAccount?.fullName || 'N/A',
      payout.paymentMethod,
      `${payout.amount?.currency || 'N/A'} ${payout.amount?.value || 'N/A'}`,
      payout.financialPartner || 'N/A',
      payout.origin || 'N/A',
      createdAt,
    ];
  };

  onViewDetails(payout: Payout): void {
    console.log('=== onViewDetails chamado ===');
    console.log('Payout:', payout);
    console.log('Navegando para: /payouts/details');

    this.router.navigate(['/payouts/details']).then(
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
    this.loadPayouts();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadPayouts();
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
    this.loadPayouts();
  }

  loadPayouts(): void {
    console.log('Iniciando carregamento de payouts...');
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log('Parâmetros:', { skip, take });

    this.payoutsService.getPayouts(skip, take).subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.payouts.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log('Loading finalizado, dados:', this.payouts());
      },
      error: (error) => {
        console.error('Erro ao carregar payouts:', error);
        this.isLoading = false;
      },
    });
  }
}
