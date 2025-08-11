import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountHoldersService } from '../../core/services/account-holders.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  AppButtonComponent,
  AppInputComponent,
  AppTableComponent,
  LoadingComponent,
  PageTitleComponent,
  PaginationComponent,
  TableColumn,
} from '../../shared/components';
import { PaginationInfo } from '../../shared/components/pagination/pagination.component';
import { AccountHolder } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';
import { PaginationService } from '../../shared/services/pagination.service';
import {
  DocumentFormatter,
  StatusFormatter,
  TypeFormatter,
} from '../../shared/utils/formatters.util';

@Component({
  selector: 'app-account-holders',
  templateUrl: './account-holders.component.html',
  styleUrls: ['./account-holders.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageTitleComponent,
    AppInputComponent,
    AppButtonComponent,
    AppTableComponent,
    LoadingComponent,
    PaginationComponent,
    LocalePipe,
  ],
})
export class AccountHoldersComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  isLoading = false;
  private localeSubscription: Subscription | null = null;

  readonly ITEMS_PER_PAGE = 20;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'id', type: 'id' },
    { key: 'type', label: 'type', type: 'text' },
    { key: 'document', label: 'document', type: 'text' },
    { key: 'fullName', label: 'fullName', type: 'text' },
    { key: 'email', label: 'email', type: 'text' },
    { key: 'country', label: 'country', type: 'text' },
    { key: 'phone', label: 'phone', type: 'text' },
    { key: 'status', label: 'status', type: 'status' },
  ];

  tableRows: AccountHolder[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translationService: TranslationService,
    private toastService: ToastService,
    private accountHoldersService: AccountHoldersService,
    private paginationService: PaginationService
  ) {
    this.filterForm = this.fb.group({
      email: [''],
      document: [''],
      fullName: [''],
    });
  }

  ngOnInit(): void {
    this.updateTableColumns();
    this.loadAccountHolders(1);

    this.localeSubscription = this.translationService.currentLocale$.subscribe(
      () => {
        this.updateTableColumns();
      }
    );
  }

  loadAccountHolders(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;

    const request = this.paginationService.createPaginationRequest(
      page,
      this.ITEMS_PER_PAGE,
      {
        email: this.filterForm.get('email')?.value || undefined,
        document: this.filterForm.get('document')?.value || undefined,
        fullName: this.filterForm.get('fullName')?.value || undefined,
      }
    );

    this.accountHoldersService
      .getAccountHoldersList(request as unknown as AccountHolder)
      .subscribe({
        next: (response) => {
          if (response.data && Array.isArray(response.data)) {
            this.tableRows = response.data;

            this.totalItems = response.total || 50;
            this.totalPages = Math.ceil(this.totalItems / this.ITEMS_PER_PAGE);
          } else {
            this.toastService.error('Erro ao carregar account holders', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.toastService.error('Erro ao carregar account holders', 3000);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.localeSubscription) {
      this.localeSubscription.unsubscribe();
    }
  }

  updateTableColumns(): void {
    this.tableColumns = [
      { key: 'id', label: this.translationService.translate('id'), type: 'id' },
      {
        key: 'type',
        label: this.translationService.translate('type'),
        type: 'text',
      },
      {
        key: 'document',
        label: this.translationService.translate('document'),
        type: 'text',
      },
      {
        key: 'fullName',
        label: this.translationService.translate('fullName'),
        type: 'text',
      },
      {
        key: 'email',
        label: this.translationService.translate('email'),
        type: 'text',
      },
      {
        key: 'country',
        label: this.translationService.translate('country'),
        type: 'text',
      },
      {
        key: 'phone',
        label: this.translationService.translate('phone'),
        type: 'text',
      },
      {
        key: 'status',
        label: this.translationService.translate('status'),
        type: 'status',
      },
    ];
  }

  onFilter(): void {
    this.loadAccountHolders(1);
    this.toastService.info(
      this.translationService.translate('filter') + ' aplicado com sucesso!',
      2000
    );
  }

  onFilterAndClose(): void {
    this.onFilter();
    setTimeout(() => {
      this.isMobileFiltersOpen = false;
    }, 100);
  }

  onClear(): void {
    this.filterForm.reset();
    this.loadAccountHolders(1);
    this.toastService.success('Filtros limpos com sucesso!', 2000);
  }

  onClearAndClose(): void {
    this.onClear();
    this.toggleMobileFilters();
  }

  onPageChange(page: number): void {
    this.loadAccountHolders(page);
  }

  get paginationInfo(): PaginationInfo {
    return this.paginationService.createPaginationInfo(
      this.currentPage,
      this.totalItems,
      this.ITEMS_PER_PAGE
    );
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return Object.values(formValue).some(
      (value) => value !== null && value !== '' && value !== undefined
    );
  }

  getActiveFiltersCount(): number {
    const formValue = this.filterForm.value;
    return Object.values(formValue).filter(
      (value) => value !== null && value !== '' && value !== undefined
    ).length;
  }

  onViewDetails = (row: AccountHolder): void => {
    this.router.navigate(['/account-holders', row.id]);
  };

  mapRowToColumns = (row: AccountHolder): string[] => {
    return [
      row.id,
      TypeFormatter.translateType(row.type),
      DocumentFormatter.format(row.document),
      row.fullName,
      row.email || '-',
      TypeFormatter.translateCountry(row.country),
      row.phone || '-',
      StatusFormatter.format(row.active),
    ];
  };
}
