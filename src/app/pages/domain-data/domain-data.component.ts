import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomainDataService } from '../../core/services/domain-data.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';
import { AppTableComponent } from '../../shared/components/app-table/app-table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { DomainData } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';

@Component({
  selector: 'app-domain-data',
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
  templateUrl: './domain-data.component.html',
  styleUrl: './domain-data.component.css',
})
export class DomainDataComponent implements OnInit {
  isLoading = false;
  domainData = signal<DomainData[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: 'id', label: 'ID', type: 'id' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'value', label: 'Value', type: 'text' as const },
    { key: 'type', label: 'Type', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'status' as const },
    { key: 'createdAt', label: 'Created At', type: 'date' as const },
    { key: 'updatedAt', label: 'Updated At', type: 'date' as const },

  ];

  constructor(
    private domainDataService: DomainDataService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      description: [''],
      value: [''],
      type: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.loadDomainData();
  }

  get tableRows() {
    return this.domainData();
  }

  mapRowToColumns = (item: DomainData) => [
    item.id,
    item.description,
    item.value,
    item.type,
    item.status,
    item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('pt-BR')
      : 'N/A',
    item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString('pt-BR')
      : 'N/A',
  ];

  onViewDetails(item: DomainData): void {
    console.log('Ver detalhes do domain data:', item);
    // Implementar navegação para detalhes
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadDomainData();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadDomainData();
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
    this.loadDomainData();
  }

  loadDomainData(): void {
    console.log('Iniciando carregamento de domain data...');
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log('Parâmetros:', { skip, take });

    this.domainDataService.getDomainData(skip, take).subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.domainData.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log('Loading finalizado, dados:', this.domainData());
      },
      error: (error) => {
        console.error('Erro ao carregar domain data:', error);
        this.isLoading = false;
      },
    });
  }
}
